// signalR
import * as signalR from "@microsoft/signalr";
// types
import { HubLog, HubScope } from "@/types/HubModels";
// utils
import { APP_VARS, isDebug } from "@/utils/environments";
import RxSource from "@/utils/rx/SourceRx";

export default class SignalRService {
    private _client?: signalR.HubConnection;
    private _logStream?: RxSource<HubLog | HubScope>;
    private _disconnectedByuser = false;

    public connect(logStream?: RxSource<HubLog | HubScope>): void {
        if (!this._client) {
            if (logStream) {
                this._logStream = logStream;
                this._disconnectedByuser = false;
            }
            if (isDebug()) {
                console.debug('Start connecting to SignalR');
            }
            this._client = new signalR.HubConnectionBuilder()
                .withUrl(`${APP_VARS.serverUrl}:${APP_VARS.signalPort}/${APP_VARS.signalLogHub}`)
                .build();

            this._client.on("BroadcastLog", data => {
                // if (isDebug()) {
                //     console.debug('SignalR: Recieved new log', data);
                // }
                this._logStream?.emit(new HubLog(data));
            });

            this._client.on("BroadcastScope", data => {
                // if (isDebug()) {
                //     console.debug('SignalR: Recieved new scope', data);
                // }
                this._logStream?.emit(new HubScope(data));
            });

            this._client.onclose(async () => {
                await this.reconnect();
            });

            this._client
                .start()
                .then(() => {
                    if (isDebug()) {
                        console.debug('SignalR: connected!');
                    }
                });

            // call method in hub
            //.then(() => this._client!.invoke("Hi", "Hello"))
        } else if (isDebug()) {
            console.debug('SignalR: already connected, skip..');
        }
    }

    public async disconnect(byUser: boolean): Promise<void> {
        if (byUser) {
            this._disconnectedByuser = true;
        }

        if (this._client) {
            if (isDebug()) {
                console.debug('Disconnect from SignalR');
            }
            await this._client.stop();
            this._client = void 0;
        }
    }

    private async reconnect(): Promise<void> {
        await this.disconnect(false);
        if (!this._disconnectedByuser) {
            if (isDebug()) {
                console.debug('SignalR: reconnecting!');
            }
            this.connect();
        }
    }
}
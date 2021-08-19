// signalR
import * as signalR from "@microsoft/signalr";
// types
import { HubLog, HubScope } from "@/types/HubModels";
// utils
import { APP_VARS, isDebug } from "@/utils/environments";
import RxSource from "@/utils/rx/SourceRx";

export default class SignalRService {
    private _client?: signalR.HubConnection;

    public connect(logStream: RxSource<HubLog | HubScope>): void {
        if (!this._client) {
            if (isDebug()) {
                console.debug('Start connecting to SignalR');
            }
            this._client = new signalR.HubConnectionBuilder()
                .withUrl(`${APP_VARS.serverUrl}:${APP_VARS.signalPort}/${APP_VARS.signalLogHub}`)
                .build();

            this._client.on("BroadcastLog", data => {
                logStream.emit(new HubLog(data));
            });

            this._client.on("BroadcastScope", data => {
                logStream.emit(new HubScope(data));
            });

            this._client.start();

            // call method in hub
            //.then(() => this._client!.invoke("Hi", "Hello"))
        }
    }

    public async disconnect(): Promise<void> {
        if (this._client) {
            if (isDebug()) {
                console.debug('Disconnect from SignalR');
            }
            await this._client.stop();
            this._client = void 0;
        }
    }
}
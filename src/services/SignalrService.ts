// signalR
import * as signalR from "@microsoft/signalr";
// types
import { HubLog } from "@/types/HubModels";
// utils
import { APP_VARS } from "@/utils/environments";
import RxSource from "@/utils/rx/SourceRx";

export default class SignalRService {
    private _client?: signalR.HubConnection;

    public connect(logStream: RxSource<HubLog>): void {
        if (!this._client) {
            this._client = new signalR.HubConnectionBuilder()
                .withUrl(`${APP_VARS.serverUrl}:${APP_VARS.signalPort}/${APP_VARS.signalLogHub}`)
                .build();

            this._client.on("BroadcastLog", data => {
                logStream.emit(new HubLog(data));
            });

            this._client.start();
            
            // call method in hub
            //.then(() => this._client!.invoke("Hi", "Hello"))
        }
    }

    public async disconnect(): Promise<void> {
        if (this._client) {
            await this._client.stop();
            this._client = void 0;
        }
    }
}
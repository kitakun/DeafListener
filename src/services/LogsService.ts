// grpc
import { LoggerClientClient } from '@/proto/generated/Logi_clientServiceClientPb';
import { FetchLogRequest, HelloRequest, PingRequest } from "@/proto/generated/logi_client_pb";
// types
import { DeafLog, DeafScope } from '@/types/FetchModels';
import { HubLog, HubScope } from '@/types/HubModels';
// services
import { APP_VARS, isDebug } from '@/utils/environments';
import RxSource from '@/utils/rx/SourceRx';
import MapService from './MapService';

export default class LogsService {
    private _client: LoggerClientClient;

    private readonly mapService = new MapService();
    public readonly logsStream = new RxSource<HubLog | HubScope>();

    constructor() {
        this._client = new LoggerClientClient(`${APP_VARS.serverUrl}:${APP_VARS.protoPort}`);
    }

    public async ping(): Promise<boolean> {
        try {
            const response = await this._client.ping(new PingRequest(), null);
            if (response && response.toObject())
                return true;
        } catch {
            // bad
        }
        return false;
    }

    public async Hello(): Promise<any> {
        try {
            const response = await this._client.hello(new HelloRequest(), null);
            return response.toObject();
        } catch {

        }
        return null;
    }

    public async fetch(from?: number, searchQuery?: string): Promise<(DeafScope | DeafLog)[]> {
        const request = new FetchLogRequest();
        if (from) {
            request.setFrom(from);
        }
        if (searchQuery) {
            request.setQuery(searchQuery);
        }

        const resp = await this._client.fetch(request, {});
        const jsResp = resp.toObject();

        if (jsResp.issuccess) {
            if (isDebug()) {
                console.log('recieved', jsResp);
            }
            return this.mapService.mapFetchToClient(jsResp);
        }

        console.error(jsResp.error);
        return [];
    }
}
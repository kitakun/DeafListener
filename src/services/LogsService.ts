// grpc
import { LoggerClientClient } from '@/proto/generated/Logi_clientServiceClientPb';
import { FetchLogRequest, HelloRequest, PingRequest } from "@/proto/generated/logi_client_pb";
import { Timestamp } from "@/proto/generated/timestamp_pb";

// types
import { DeafLog, DeafScope, IHelloObject } from '@/types/FetchModels';
import { HubLog, HubScope } from '@/types/HubModels';
import LoadingAction from '@/types/LoadingServiceModels';
// services
import { APP_VARS, isDebug } from '@/utils/environments';
import RxSource from '@/utils/rx/SourceRx';
import MapService from './MapService';

export interface IFetchFilterQuery {
    searchQuery?: string;
    selectedEnvs?: string[];
    selectedProjects?: string[];
    selectedDates: {
        from?: Date | undefined;
        to?: Date | undefined;
    }
}

export default class LogsService {
    public static readonly FETCH_COUNT = 40;

    private _client: LoggerClientClient;

    private readonly mapService = new MapService();
    public readonly logsStream = new RxSource<HubLog | HubScope>();

    public get TakeFetchCount(): number {
        // TODO move this value to settings and make configurable
        return LogsService.FETCH_COUNT;
    }

    constructor() {
        this._client = new LoggerClientClient(`${APP_VARS.serverUrl}:${APP_VARS.protoPort}`);
    }

    public async ping(loader?: LoadingAction): Promise<boolean> {
        try {
            const response = await this._client.ping(new PingRequest(), null);
            if (loader?.isCancelled ?? false) {
                return false;
            }
            if (response && response.toObject())
                return true;
        } catch {
            // bad
        } finally {
            loader?.finish();
        }
        return false;
    }

    public async Hello(loader?: LoadingAction): Promise<IHelloObject | null> {
        try {
            const response = await this._client.hello(new HelloRequest(), null);
            if (loader?.isCancelled ?? false) {
                return null;
            }
            return response.toObject();
        } catch {
            // ignore
        } finally {
            loader?.finish();
        }
        return null;
    }

    public async fetch(from?: number, filters?: IFetchFilterQuery, loader?: LoadingAction): Promise<(DeafScope | DeafLog)[]> {
        console.log('lets load');
        const request = new FetchLogRequest();
        if (from) {
            request.setFrom(from);
            request.setTake(this.TakeFetchCount);
        }
        if (filters) {
            if (filters.searchQuery) {
                request.setQuery(filters.searchQuery);
            }
            if (filters.selectedEnvs && filters.selectedEnvs.length) {
                request.setEnvesList(filters.selectedEnvs);
            }
            if (filters.selectedProjects && filters.selectedProjects.length) {
                request.setProjectsList(filters.selectedProjects);
            }
            if (filters.selectedDates) {
                if (filters.selectedDates.from) {
                    const timeMs = filters.selectedDates.from.getTime();
                    var fromTimestamp = new Timestamp();
                    fromTimestamp.setSeconds(Math.floor(timeMs / 1000));
                    fromTimestamp.setNanos((timeMs % 1000) * 1e6);
                    request.setFromdate(fromTimestamp);
                }
                if (filters.selectedDates.to) {
                    const timeMs = filters.selectedDates.to.getTime();
                    var fromTimestamp = new Timestamp();
                    fromTimestamp.setSeconds(Math.floor(timeMs / 1000));
                    fromTimestamp.setNanos((timeMs % 1000) * 1e6);
                    request.setTodate(fromTimestamp);
                }
            }
        }

        try {
            const resp = await this._client.fetch(request, {});
            if (loader?.isCancelled ?? false) {
                return [];
            }
            const jsResp = resp.toObject();

            if (jsResp.issuccess) {
                if (isDebug()) {
                    console.log('recieved', jsResp);
                }
                return this.mapService.mapFetchToClient(jsResp);
            }

            console.error(jsResp.error);
        } finally {
            loader?.finish();
        }
        return [];
    }
}
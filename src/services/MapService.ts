// grpc
import { FetchLogResponse, LogLevel, LogMessage, LogScope } from "@/proto/generated/logi_client_pb";
// types
import { DeafExceptionLog, DeafLog, DeafScope } from '@/types/FetchModels';
import { LogPreviewData } from "@/types/LogRenderModels";
// utils
import { formatLogTime } from "@/utils/datetime";
import { toDate } from "@/utils/protos";

export default class MapService {

    public mapFetchToClient(jsResp: FetchLogResponse.AsObject): (DeafScope | DeafLog)[] {
        const logsWithoutScope = jsResp
            .logsList
            .filter(f => f.ownerscopeid <= 0)
            .map(this.fetchLogToDeafLog);

        const initialScopes = jsResp
            .scopesList
            .filter(f => f.ownerscopeid <= 0)
            .map(scope => this.fetchScopeToDeafScope(scope, jsResp));

        return [...logsWithoutScope, ...initialScopes];
    }

    public fetchLogToDeafLog(log: LogMessage.AsObject): DeafLog {
        if (log.level !== LogLevel.ERROR) {
            return new DeafLog({
                logId: log.logid,
                createdAt: toDate(log.createdat),
                level: log.level,
                message: log.message,
                parameterMap: log.parametersMap
            });
        } else {
            return new DeafExceptionLog({
                logId: log.logid,
                createdAt: toDate(log.createdat),
                level: log.level,
                message: log.message,
                parameterMap: log.parametersMap,
                exceptionTitle: log.exceptiontitle,
                stackTrace: log.stacktrace,
            });
        }
    }

    public fetchScopeToDeafScope(
        scope: LogScope.AsObject,
        jsResp: FetchLogResponse.AsObject,
        sortedData?: (LogMessage.AsObject | LogScope.AsObject)[]
    ): DeafScope {
        const innerLogs = jsResp
            .logsList
            .filter(f => f.ownerscopeid === scope.scopeid || f.ownerscopeid === scope.scopeid);

        const innerScopes = jsResp
            .scopesList
            .filter(f => f.ownerscopeid === scope.scopeid || f.rootscopeid === scope.scopeid);

        if (!sortedData) {
            sortedData = this.getSortedMessages(scope, jsResp, innerLogs, innerScopes);
        }
        
        const result = new DeafScope({
            createdAt: toDate(scope.createdat),
            scopeId: scope.scopeid,
            innerLogs: innerLogs.map(this.fetchLogToDeafLog),
            innerScopes: innerScopes
                .filter(f => f.ownerscopeid === scope.scopeid)
                .map(inScope => this.fetchScopeToDeafScope(inScope, jsResp, sortedData)),
            // computed
            logsBlockPreviev: this.lookForLogsPreview(scope.scopeid, jsResp, sortedData)
        });
        return result;
    }

    private lookForLogsPreview(
        scopeId: number,
        rawData: FetchLogResponse.AsObject,
        sortedData: (LogMessage.AsObject | LogScope.AsObject)[],
        arrayToAdd?: LogPreviewData[]): LogPreviewData[] {

        const targetScope = rawData?.scopesList?.find(f => f.scopeid === scopeId);

        if (targetScope && sortedData.length) {
            const sortedScopeData = this.getSortedMessages(targetScope, rawData);
            const resultLogs: LogPreviewData[] = arrayToAdd || [];
            for (var i = 0; i < sortedScopeData.length; i++) {
                const curElement = sortedScopeData[i];
                if ((curElement as LogScope.AsObject).scopeid) {
                    const curScopeEl = curElement as LogScope.AsObject;

                    if (curScopeEl.ownerscopeid !== targetScope.scopeid)
                        continue;

                    const scopeInnerData: LogPreviewData[] = [];

                    // this is scope!
                    this.lookForLogsPreview(
                        curScopeEl.scopeid,
                        rawData,
                        sortedData,
                        scopeInnerData
                    );

                    resultLogs.push({
                        isScope: true,
                        text: scopeInnerData.find(f => !f.isScope)?.text ?? '-',
                        innerLogs: scopeInnerData,
                        createdAt: formatLogTime(toDate(curScopeEl.createdat))
                    } as LogPreviewData);

                } else {
                    // this is log msg
                    const logMsg = curElement as LogMessage.AsObject;
                    resultLogs.push({
                        id: logMsg.logid,
                        isScope: false,
                        text: logMsg.message,
                        createdAt: formatLogTime(toDate(logMsg.createdat)),
                        isException: !!logMsg.exceptiontitle
                    } as LogPreviewData);
                }
            }
            return resultLogs;
        }
        return [];
    }

    /* get all messages (scopes and logs) sorted by created date */
    private getSortedMessages(
        scope: LogScope.AsObject,
        jsResp: FetchLogResponse.AsObject,
        innerLogs?: LogMessage.AsObject[],
        innerScopes?: LogScope.AsObject[],
    ) {
        if (!innerLogs) {
            innerLogs = jsResp
                .logsList
                .filter(f => f.ownerscopeid === scope.scopeid || f.ownerscopeid === scope.scopeid);
        }

        if (!innerScopes) {
            innerScopes = jsResp
                .scopesList
                .filter(f => f.ownerscopeid === scope.scopeid || f.rootscopeid === scope.scopeid);
        }

        const mergetScopesNlogs = [...innerLogs, ...innerScopes];
        for (const innerScope of innerScopes) {
            innerScope.scopeid
        }

        return mergetScopesNlogs.sort((x, y) => {
            const dateA = toDate(x.createdat);
            const dateB = toDate(y.createdat);
            if (dateA < dateB)
                return -1;
            if (dateA > dateB) return 1;
            return 0;
        });
    }
}
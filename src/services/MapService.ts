// grpc
import { FetchLogResponse, LogLevel, LogMessage, LogScope } from "@/proto/generated/logi_client_pb";
// types
import { DeafExceptionLog, DeafLog, DeafScope } from '@/types/FetchModels';
import { HubLog, HubScope } from "@/types/HubModels";
import { LogPreviewData } from "@/types/LogRenderModels";
// utils
import { formatLogTime } from "@/utils/datetime";
import { toDate } from "@/utils/protos";
import { sortByCreatedDate, sortByDate, sortByStringDate } from "@/utils/sort";

export default class MapService {

    /**
     * map grpc JS response to deaf models (log + scopes)
     * @param jsResp fetch grpc JS object response
     * @returns Deaf scopes and logs array
     */
    public mapFetchToClient(jsResp: FetchLogResponse.AsObject): (DeafScope | DeafLog)[] {
        const logsWithoutScope = jsResp
            .logsList
            .filter(f => f.ownerscopeid <= 0)
            .map(this.fetchLogToDeafLog);

        const initialScopes = jsResp
            .scopesList
            .filter(f => f.ownerscopeid <= 0)
            .map(scope => this.fetchScopeToDeafScope(scope, jsResp));

        return [...logsWithoutScope, ...initialScopes].sort(sortByCreatedDate);
    }

    /**
     * Map grpc JS log message to vue-deaf-client model
     * @param log grpc JS object
     * @returns mapped DeafLog object
     */
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

    /** map fetchScopeModel to DeafScope */
    private fetchScopeToDeafScope(
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
        });
        // computed
        result.logsBlockPreviev = this.createLogPreviewFor(result);

        return result;
    }

    /**
     * Immutable array operation: add new scope to existing data
     * @param hubScope new recieved scope
     * @param existingData exsisting data array
     * @returns new data array (or same if no changes was applied)
     */
    public applyHubScopeToData(hubScope: HubScope, existingData: (DeafScope | DeafLog)[]): (DeafScope | DeafLog)[] {
        if (!hubScope.ownerScopeId || hubScope.ownerScopeId <= 0) {
            // create root scope
            const result = new DeafScope({
                createdAt: hubScope.createdAt,
                scopeId: hubScope.id,
                innerLogs: [],
                innerScopes: [],
                logsBlockPreviev: [{
                    createdAt: '-',
                    isScope: false,
                    innerLogs: [],
                    text: 'Empty scope'
                }]
            });

            return [...existingData, result].sort(sortByCreatedDate);
        } else {
            // create parented scope
            const rootScopeId = hubScope.rootScopeId;
            const rootScope = existingData.find(f => f instanceof DeafScope && f.scopeId === rootScopeId) as DeafScope;
            if (rootScope) {
                const ownerScope = this.lookForOwnerScope(hubScope.ownerScopeId, rootScope);
                if (ownerScope) {
                    ownerScope.innerScopes.push(new DeafScope({
                        createdAt: hubScope.createdAt,
                        innerLogs: [],
                        innerScopes: [],
                        scopeId: hubScope.id,
                        logsBlockPreviev: this.createLogPreviewFor(ownerScope),
                    }));
                    ownerScope.innerScopes = ownerScope.innerScopes.sort(sortByCreatedDate);
                }
            }
        }
        // do nothing
        return existingData;
    }

    /**
     * Immutable array operation: add new log to existing data
     * @param hubLog new log data
     * @param existingData exsisting data array
     * @returns new data array (or same if no changes was applied)
     */
    public applyHubLogToData(hubLog: HubLog, existingData: (DeafScope | DeafLog)[]): (DeafScope | DeafLog)[] {
        const rootScopeId = hubLog.rootScopeId;
        const rootScope = existingData.find(f => f instanceof DeafScope && f.scopeId === rootScopeId);
        if (rootScope && rootScope instanceof DeafScope) {
            const newData = [...existingData];
            const parentScope = this.lookForOwnerScope(hubLog.ownerScopeId, rootScope);
            if (parentScope) {
                parentScope.innerLogs.push(new DeafLog({
                    message: hubLog.message,
                    level: hubLog.logLevel,
                    logId: hubLog.id,
                    createdAt: hubLog.createdAt,
                    parameterMap: [],
                }));
                parentScope.logsBlockPreviev = this.createLogPreviewFor(parentScope);
                rootScope.logsBlockPreviev = this.createLogPreviewFor(rootScope);
                return newData;
            }
        }
        // we can't add this log due root scope is not visible
        return existingData;
    }

    /**
     * Get all protoJS messages (scopes and logs) sorted by created date
     * @param scope 
     * @param jsResp raw proto JS response
     * @param innerLogs preloaded inner logs of the scope (if null - will be loaded from jsResp, this parameter created for optimization and reusability)
     * @param innerScopes 
     * @returns raw protoJS messages (scopes and logs) sorted by created date
     */
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

        return mergetScopesNlogs.sort((a, b) => sortByDate(toDate(a.createdat), toDate(b.createdat)));
    }

    /**
     * Get owner scope for scopeId
     * @param scopeId scope ID for which we will look a parent
     * @param rootScope initial root scope
     * @returns parent scope
     */
    private lookForOwnerScope(scopeId: number, rootScope: DeafScope): DeafScope | null {
        if (rootScope.scopeId === scopeId) {
            return rootScope;
        }

        for (const innerScope of rootScope.innerScopes) {
            if (innerScope.scopeId === scopeId) {
                return innerScope;
            } else {
                const res = this.lookForOwnerScope(scopeId, innerScope);
                if (res) {
                    return res;
                }
            }
        }

        return null;
    }

    /**
     * Update rendering information for scope
     * @param forScope scope
     * @returns new array of rendering information
     */
    private createLogPreviewFor(forScope: DeafScope): LogPreviewData[] {
        const getPreview = (inForScope: DeafScope): LogPreviewData[] | null => {
            let inPrev: LogPreviewData[] | null = null;
            if (inForScope.innerLogs.length > 0 || inForScope.innerScopes.length > 0) {
                const logsAndScopes = [...inForScope.innerLogs, ...inForScope.innerScopes].sort(sortByCreatedDate);
                for (const data of logsAndScopes) {
                    if (data instanceof DeafLog) {
                        if (!inPrev) {
                            inPrev = [];
                        }
                        inPrev.push({
                            isScope: false,
                            createdAt: formatLogTime(data.createdAt),
                            id: data.logId,
                            innerLogs: [],
                            // TODO exception support
                            isException: false,
                            text: data.message,
                        });
                    } else if (data instanceof DeafScope) {
                        const inner = getPreview(data);
                        if (inner) {
                            const scopeOwner = {
                                isScope: true,
                                text: inner.find(f => !f.isScope)?.text ?? '-',
                                innerLogs: inner,
                                createdAt: formatLogTime(data.createdAt)
                            } as LogPreviewData;
                            if (!inPrev) {
                                inPrev = [scopeOwner];
                            } else {
                                inPrev.push(scopeOwner);
                            }
                        }
                    }
                }
            }
            return inPrev;
        };
        const rslt = getPreview(forScope);
        if (rslt) {
            rslt.sort(sortByStringDate);
            return rslt;
        }
        return [];
    }
}
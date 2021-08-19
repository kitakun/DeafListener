import { LogLevel } from "@/proto/generated/logi_client_pb";

export class HubLog {
    public createdAt: Date;
    public errorTitle?: string;
    public id: number;
    public logLevel: LogLevel;
    public message: string;
    public ownerScopeId: number;
    public rootScopeId: number;
    public stackTrace?: string;

    constructor(data: Partial<HubLog>) {
        this.createdAt = data && data.createdAt ? new Date(Date.parse(data?.createdAt as any)) : new Date();
        this.id = data.id!;
        this.logLevel = data.logLevel ?? LogLevel.INFORMATION;
        this.message = data.message ?? '-';
        this.ownerScopeId = data.ownerScopeId ?? 0;
        this.rootScopeId = data.rootScopeId ?? 0;
        this.stackTrace = data.stackTrace ?? '-';
    }
}

export class HubScope {
    id: number;
    createdAt: Date;

    rootScopeId?: number;
    ownerScopeId?: number;

    project: string;
    environment: string;

    constructor(data: Partial<HubScope>) {
        this.id = data.id ?? 0;
        this.createdAt = data.createdAt ?? new Date();
        this.rootScopeId = data.rootScopeId ?? -2;
        this.ownerScopeId = data.ownerScopeId ?? -2;
        this.project = data.project ?? '-';
        this.environment = data.environment ?? '-';
    }
}
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
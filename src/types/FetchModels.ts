import { LogLevel } from "@/proto/generated/logi_client_pb";
import { LogPreviewData } from "./LogRenderModels";

export interface IFetchResults {
    logs: DeafScope[];
}

export interface DeafRenderable {
    isVisible: boolean;
}

export class DeafScope implements DeafRenderable {
    scopeId!: number;
    createdAt!: Date;
    innerScopes!: DeafScope[];
    innerLogs!: DeafLog[]
    // computed
    logsBlockPreviev!: LogPreviewData[];
    isVisible!: boolean;

    constructor(data?: Partial<DeafScope>) {
        this.scopeId = data?.scopeId || 0;
        this.createdAt = data?.createdAt || new Date();
        this.innerScopes = data?.innerScopes || [];
        this.innerLogs = data?.innerLogs || [];
        this.logsBlockPreviev = data?.logsBlockPreviev || [];
        this.isVisible = false;
    }
}

export class DeafLog implements DeafRenderable {
    logId!: number;
    createdAt!: Date;
    level!: LogLevel;
    message!: string;
    parameterMap!: any[];
    // computed
    isVisible!: boolean;

    constructor(data?: Partial<DeafLog>) {
        if (!data || !data.logId)
            throw new Error(`Log can't be without ID`);

        this.logId = data.logId;
        this.createdAt = data?.createdAt || new Date();
        this.level = data?.level || 0;
        this.message = data?.message || '';
        this.parameterMap = data?.parameterMap || [];
        this.isVisible = false;
    }
}

export class DeafExceptionLog extends DeafLog {
    stackTrace!: string;
    exceptionTitle!: string;

    constructor(data?: Partial<DeafExceptionLog>) {
        super(data);
        this.stackTrace = data?.stackTrace || '';
        this.exceptionTitle = data?.exceptionTitle || '';
    }
}

export interface IHelloObject {
    envsToProjectsList: { key: string, valueList: string[] }[];
    databasesize: string;
    error?: string;
}
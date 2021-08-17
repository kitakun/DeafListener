
export interface LogPreviewData {
    isScope: boolean;
    id?: number;
    text?: string;
    isException?: boolean;
    innerLogs?: LogPreviewData[];
    createdAt: string;
}
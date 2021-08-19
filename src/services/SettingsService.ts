import RxSource from "@/utils/rx/SourceRx";
import RxVariable from "@/utils/rx/VariableRx";

export default class SettingsService {
    public readonly logViewType: RxVariable<Header_LogViewTypeEnum>;
    public readonly logDirectionViewType: RxVariable<Header_LogDirectionViewTypeEnum>;
    public readonly searchStream: RxSource<string>;
    public readonly livetypeLoadingStream: RxVariable<boolean>;

    constructor() {
        this.logViewType = new RxVariable<Header_LogViewTypeEnum>(Header_LogViewTypeEnum.ShowAllScopes, true)
        this.logDirectionViewType = new RxVariable<Header_LogDirectionViewTypeEnum>(Header_LogDirectionViewTypeEnum.Grid, true)
        this.searchStream = new RxSource<string>();
        this.livetypeLoadingStream = new RxVariable<boolean>(true, true);
    }
}

export enum Header_LogViewTypeEnum {
    ShowOnlyMainScope = 0,
    ShowAllScopes = 1,
    DefaultLogsView = 2,
}

export enum Header_LogDirectionViewTypeEnum {
    Grid = 0,
    VerticalLine = 1,
}
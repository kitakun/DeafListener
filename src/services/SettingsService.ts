import RxVariable from "@/utils/rx/VariableRx";

export default class SettingsService {
    public readonly logViewType: RxVariable<Header_LogViewTypeEnum>;
    public readonly logDirectionViewType: RxVariable<Header_LogDirectionViewTypeEnum>;
    public readonly searchStream: RxVariable<string>;
    public readonly livetypeLoadingStream: RxVariable<boolean>;

    constructor() {
        this.logViewType = new RxVariable<Header_LogViewTypeEnum>(Header_LogViewTypeEnum.ShowAllScopes)
        this.logDirectionViewType = new RxVariable<Header_LogDirectionViewTypeEnum>(Header_LogDirectionViewTypeEnum.Grid)
        this.searchStream = new RxVariable('');
        this.livetypeLoadingStream = new RxVariable<boolean>(true);
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
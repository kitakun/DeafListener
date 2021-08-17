import RxVariable from "@/utils/rx/VariableRx";

export default class HeaderService {
    public readonly logViewType: RxVariable<Header_LogViewTypeEnum>;
    public readonly searchStream: RxVariable<string>;
    
    constructor() {
        this.logViewType = new RxVariable<Header_LogViewTypeEnum>(Header_LogViewTypeEnum.ShowAllScopes)
        this.searchStream = new RxVariable('');
    }
}

export enum Header_LogViewTypeEnum {
    ShowOnlyMainScope = 0,
    ShowAllScopes = 1,
    DefaultLogsView = 2,
}
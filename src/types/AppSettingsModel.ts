import { Header_LogViewTypeEnum, Header_LogDirectionViewTypeEnum } from "./SettingEnums";

export interface AppSettingsData {
    enableLive: boolean;
    logViewType: Header_LogViewTypeEnum;
    logDirectionType: Header_LogDirectionViewTypeEnum;
}
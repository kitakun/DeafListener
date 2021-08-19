// service
import StorageService from "./StorageService";
// types | utils
import RxSource from "@/utils/rx/SourceRx";
import RxVariable from "@/utils/rx/VariableRx";
import { Header_LogViewTypeEnum, Header_LogDirectionViewTypeEnum } from "@/types/SettingEnums";
import { AppSettingsData } from "@/types/AppSettingsModel";

const settings_key = 'app-client-settings';

export default class SettingsService {

    public readonly logViewType: RxVariable<Header_LogViewTypeEnum>;
    public readonly logDirectionViewType: RxVariable<Header_LogDirectionViewTypeEnum>;
    public readonly searchStream: RxSource<string>;
    public readonly livetypeLoadingStream: RxVariable<boolean>;

    private store?: StorageService;

    constructor() {
        this.logViewType = new RxVariable<Header_LogViewTypeEnum>(Header_LogViewTypeEnum.ShowAllScopes, true)
        this.logDirectionViewType = new RxVariable<Header_LogDirectionViewTypeEnum>(Header_LogDirectionViewTypeEnum.Grid, true)
        this.searchStream = new RxSource<string>();
        this.livetypeLoadingStream = new RxVariable<boolean>(true, true);
    }

    setStore(storeService: StorageService) {
        if (!this.store && storeService) {
            this.store = storeService;
            const loadedSettings = this.store.load<AppSettingsData>(settings_key);
            if (loadedSettings) {
                this.logViewType.setValue(loadedSettings.logViewType);
                this.logDirectionViewType.setValue(loadedSettings.logDirectionType);
                this.livetypeLoadingStream.setValue(loadedSettings.enableLive);
            }
            // listen for setts changes
            this.logViewType.on(_ => this.saveNewSetts(), false);
            this.logDirectionViewType.on(_ => this.saveNewSetts(), false);
            this.livetypeLoadingStream.on(_ => this.saveNewSetts(), false);
        } else {
            console.warn('Double setStore assign! skip..');
        }
    }

    private saveNewSetts() {
        this.store?.save<AppSettingsData>(settings_key, {
            enableLive: this.livetypeLoadingStream.value,
            logDirectionType: this.logDirectionViewType.value,
            logViewType: this.logViewType.value,
        });
    }
}
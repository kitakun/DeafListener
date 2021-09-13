// service
import StorageService from "./StorageService";
// types | utils
import RxSource from "@/utils/rx/SourceRx";
import RxVariable from "@/utils/rx/VariableRx";
import { Header_LogViewTypeEnum, Header_LogDirectionViewTypeEnum } from "@/types/SettingEnums";
import { AppSettingsData } from "@/types/AppSettingsModel";
import { IEnvsToProjects } from "@/types/SettingsModels";

const settings_key = 'app-client-settings';

export default class SettingsService {

    // logs view settings
    public readonly logViewType: RxVariable<Header_LogViewTypeEnum>;
    public readonly logDirectionViewType: RxVariable<Header_LogDirectionViewTypeEnum>;
    public readonly livetypeLoadingStream: RxVariable<boolean>;
    // logs search sources
    public readonly searchStream: RxVariable<string>;
    public readonly dateFilerStream: RxVariable<{ from?: Date, to?: Date }>;
    public readonly emitSearchStream: RxSource<null>;
    // project + env filters
    public readonly allEnvsWithProjectsStream: RxVariable<IEnvsToProjects>;
    public readonly selectedProjectStream: RxVariable<string[]>;
    public readonly selectedEnvStream: RxVariable<string[]>;

    private store?: StorageService;

    constructor() {
        this.logViewType = new RxVariable<Header_LogViewTypeEnum>(Header_LogViewTypeEnum.ShowAllScopes, true)
        this.logDirectionViewType = new RxVariable<Header_LogDirectionViewTypeEnum>(Header_LogDirectionViewTypeEnum.Grid, true)
        this.livetypeLoadingStream = new RxVariable<boolean>(false, true);
        // search
        this.searchStream = new RxVariable<string>('');
        this.dateFilerStream = new RxVariable<{ from?: Date, to?: Date }>({
            from: void 0,
            to: void 0
        });
        this.emitSearchStream = new RxSource<null>();
        // proj + env
        this.allEnvsWithProjectsStream = new RxVariable<IEnvsToProjects>({});
        this.selectedProjectStream = new RxVariable<string[]>([]);
        this.selectedEnvStream = new RxVariable<string[]>([]);
    }

    setStore(storeService: StorageService) {
        if (!this.store && storeService) {
            this.store = storeService;
            const loadedSettings = this.store.load<AppSettingsData>(settings_key);
            if (loadedSettings) {
                this.logViewType.setValue(loadedSettings.logViewType);
                this.logDirectionViewType.setValue(loadedSettings.logDirectionType);
                this.livetypeLoadingStream.setValue(loadedSettings.enableLive);
                if (Array.isArray(loadedSettings.selectedEnvs)) {
                    this.selectedEnvStream.setValue(loadedSettings.selectedEnvs);
                }
            }
            // listen for setts changes
            this.logViewType.on(_ => this.saveNewSetts(), false);
            this.logDirectionViewType.on(_ => this.saveNewSetts(), false);
            this.livetypeLoadingStream.on(_ => this.saveNewSetts(), false);
            this.selectedEnvStream.on(_ => this.saveNewSetts(), false);
        } else {
            console.warn('Double setStore assign! skip..');
        }
    }

    private saveNewSetts() {
        this.store?.save<AppSettingsData>(settings_key, {
            enableLive: this.livetypeLoadingStream.value,
            logDirectionType: this.logDirectionViewType.value,
            logViewType: this.logViewType.value,
            selectedEnvs: this.selectedEnvStream.value,
        });
    }
}
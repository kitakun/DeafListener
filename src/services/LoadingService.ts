import RxVariable from "@/utils/rx/VariableRx";
import LoadingAction from "@/types/LoadingServiceModels";

export default class LoadingService {

    // general settings
    public readonly loadingActions: RxVariable<LoadingAction[]>;

    constructor() {
        // general
        this.loadingActions = new RxVariable<LoadingAction[]>([], true);
    }

    public createNewLoading(): LoadingAction {
        const service = this;
        const loadingId = Symbol(new Date().getTime().toString());
        const newLoader = {
            id: loadingId,
            isCancelled: false,
            isFinished: false,
            finish: function () {
                this.isFinished = true;
                this.stopLoading();
            },
            cancel: function () {
                this.isCancelled = true;
                this.stopLoading();
            },
            stopLoading() {
                const curLoaders = service.loadingActions.value;
                const newVal = curLoaders.filter(f => f.id !== loadingId);
                service.loadingActions.setValue(newVal);
            }
        };
        // add to list
        service.loadingActions.setValue([...service.loadingActions.value, newLoader]);
        return newLoader;
    }
}
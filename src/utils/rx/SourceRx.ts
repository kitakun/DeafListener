type GenericVoidCallback<E> = (newVal: E) => void;
type emptyCallback = () => void;

export default class RxSource<T> {

    private _cbs: GenericVoidCallback<T>[] = [];

    public emit(newValue: T): void {
        for (const cb of this._cbs) {
            cb(newValue);
        }
    }

    public on(cb: GenericVoidCallback<T>): emptyCallback {
        this._cbs.push(cb);

        const unsubscribe = () => {
            const index = this._cbs.indexOf(cb);
            if (index > -1) {
                this._cbs = this._cbs.splice(index, 1);
            }
        };
        return unsubscribe;
    }
}
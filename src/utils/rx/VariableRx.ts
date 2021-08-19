type GenericVoidCallback<E> = (newVal: E) => void;
type emptyCallback = () => void;

export default class RxVariable<T> {

    private _value: T;
    private _cbs: GenericVoidCallback<T>[] = [];
    private readonly _emitOnSubscribe: boolean;

    public get value(): T {
        return this._value;
    }

    constructor(defaultVariable: T, emitOnSubscribe = false) {
        this._emitOnSubscribe = emitOnSubscribe;
        this._value = defaultVariable;
    }

    public setValue(newValue: T): void {
        if (this._value !== newValue) {
            this._value = newValue;
            for (const cb of this._cbs) {
                cb(this._value);
            }
        }
    }

    public on(cb: GenericVoidCallback<T>): emptyCallback {
        this._cbs.push(cb);
        if (this._emitOnSubscribe) {
            cb(this.value);
        }

        const unsubscribe = () => {
            const index = this._cbs.indexOf(cb);
            if (index > -1) {
                this._cbs = this._cbs.splice(index, 1);
            }
        };
        return unsubscribe;
    }
}
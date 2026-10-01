import { computed, makeObservable, observableRef, runInAction } from "mobx";

export class StoreErrorText {
    private _errorText: string | null;

    get errorText() {
        return this._errorText;
    }

    set errorText(value: string | null) {
        runInAction(() => {
            this._errorText = value;
        });
    }

    public resetError() {
        runInAction(() => {
            this._errorText = null;
        });
    }

    constructor() {
        this._errorText = null;

        makeObservable<this,'_errorText'>(this, {
            _errorText: observableRef,
            errorText: computed,
        });
    }
}
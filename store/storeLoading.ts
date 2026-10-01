import { computed, makeObservable, observableRef, runInAction } from "mobx";

export class StoreLoading {
    private _isLoading: boolean;

    get isLoading() {
        return this._isLoading;
    }

    public startLoading() {
        runInAction(() => {
            this._isLoading = true;
        });
    }

    public stopLoading() {
        runInAction(() => {
            this._isLoading = false;
        });
    }

    constructor(isLoading?: boolean) {
        this._isLoading = !!isLoading;

        makeObservable<this,'_isLoading'>(this, {
            _isLoading: observableRef,
            isLoading: computed,
        });
    }
}
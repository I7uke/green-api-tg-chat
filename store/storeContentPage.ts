import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { type PageContent } from "../models/pageContent";

export class StoreContentPage<T extends PageContent> {
    private _store: T | null;

    get store() {
        return this._store;
    }

    set store(value: T | null) {
        runInAction(() => {
            this._store = value;
        });
    }

    public dispose() {
        if (this._store) {
            this._store.dispose();
        }

        runInAction(() => {
            this._store = null;
        });
    }

    constructor() {
        this._store = null;

        makeObservable<this,
            '_store'
        >(this, {
            _store: observableRef,
            store: computed,
        });
    }
}

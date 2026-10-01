import { computed, makeObservable, observableRef, runInAction } from "mobx";

class StoreCurrentPageInfo {
    private _documentTitle: string;
    private _pageTitle: string;
    private _linkBack: string;
    private _pageKey: string;

    //#region documentTitle
    get documentTitle() {
        return this._documentTitle;
    }

    set documentTitle(value: string) {
        document.title = value;
        runInAction(() => {
            this._documentTitle = value;
        });
    }
    //#endregion

    //#region pageTitle
    get pageTitle() {
        return this._pageTitle;
    }

    set pageTitle(value: string) {
        runInAction(() => {
            this._pageTitle = value;
        });
    }
    //#endregion

    //#region linkBack
    get linkBack() {
        return this._linkBack;
    }

    set linkBack(value: string) {
        runInAction(() => {
            this._linkBack = value;
        });
    }
    //#endregion

    //#region pageKey
    get pageKey() {
        return this._pageKey;
    }

    set pageKey(value: string) {
        runInAction(() => {
            this._pageKey = value;
        });
    }
    //#endregion

    constructor() {
        this._documentTitle = '';
        this._pageTitle = '';
        this._linkBack = '';
        this._pageKey = '';

        makeObservable<this,
            '_documentTitle'
            | '_pageTitle'
            | '_linkBack'
            | '_pageKey'
        >(this, {
            _documentTitle: observableRef,
            _pageTitle: observableRef,
            _linkBack: observableRef,
            _pageKey: observableRef,
            documentTitle: computed,
            linkBack: computed,
            pageKey: computed,
            pageTitle: computed
        });
    }
}

export const storeCurrentPageInfo = new StoreCurrentPageInfo();
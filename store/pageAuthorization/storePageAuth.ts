import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { AbstractStorePage, type AbstractStorePageInitData } from "../base/abstractStorePage";
import { StorePageAuthContent } from "./storePageAuthContent";

export class StorePageAuth extends AbstractStorePage {
    private _contentPage: StorePageAuthContent | null;

    get contentPage() {
        return this._contentPage;
    }
    protected override _pageShown(): void {
        runInAction(() => {
            this._contentPage = new StorePageAuthContent();
        });
    }

    protected override _pageExit(): void {
        if(this._contentPage) {
            this._contentPage.dispose();
        }

        runInAction(() => {
            this._contentPage = null;
        });
    }

    constructor(initData: AbstractStorePageInitData) {
        super(initData);
        this._contentPage = null;

        makeObservable<this,
            '_contentPage'
        >(this, {
            _contentPage: observableRef,
            contentPage: computed,
        });
    }
}
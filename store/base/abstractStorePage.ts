import { v4 as uuidv4 } from 'uuid';
import { storeCurrentPageInfo } from '../global/storeCurrentPageInfo';

export interface AbstractStorePageInitData {
    readonly documentTitle: string;
    readonly pageTitle?: string;
    readonly linkBack?: string;
    readonly pageKey?: string;
}

export abstract class AbstractStorePage {
    private readonly _documentTitle: string;
    private readonly _pageTitle: string;
    private readonly _linkBack: string;
    private readonly _pageKey: string;

    protected abstract _pageExit(): void;
    protected abstract _pageShown(): void;

    public eventPageExit() {
        this._pageExit();
    };

    public eventPageShown() {
        storeCurrentPageInfo.documentTitle = this._documentTitle;
        storeCurrentPageInfo.linkBack = this._linkBack;
        storeCurrentPageInfo.pageKey = this._pageKey;
        storeCurrentPageInfo.pageTitle = this._pageTitle

        this._pageShown();
    }

    get pageKey() {
        return this._pageKey;
    }

    constructor(initData: AbstractStorePageInitData) {
        this.eventPageExit = this.eventPageExit.bind(this);
        this.eventPageShown = this.eventPageShown.bind(this);

        this._documentTitle = initData.documentTitle;
        this._linkBack = initData.linkBack ?? '';
        this._pageKey = initData.pageKey ? initData.pageKey : uuidv4();
        this._pageTitle = initData.pageTitle ?? '';
    }
}
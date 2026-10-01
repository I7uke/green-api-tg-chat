import { computed, makeObservable, observableRef, runInAction } from "mobx";

const LOCAL_STORAGE_KEY_ID_INSTANCE = 'idInstance';
const LOCAL_STORAGE_KEY_API_TOKEN_INSTANCE = 'apiTokenInstance';

export class StoreAuthData {
    private _apiTokenInstance: string;
    private _idInstance: string;

    //#region apiTokenInstance
    get apiTokenInstance() {
        return this._apiTokenInstance;
    }

    set apiTokenInstance(value: string) {
        runInAction(() => {
            this._apiTokenInstance = value;
        });
    }
    //#endregion

    //#region idInstance
    get idInstance() {
        return this._idInstance;
    }

    set idInstance(value: string) {
        runInAction(() => {
            this._idInstance = value;
        });
    }
    //#endregion

    public logOut() {
        runInAction(() => {
            this._idInstance = '';
            this._idInstance = '';
        });
        this.saveInLocalStorage();
    }

    public saveInLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_KEY_API_TOKEN_INSTANCE, this._apiTokenInstance);
        localStorage.setItem(LOCAL_STORAGE_KEY_ID_INSTANCE, this._idInstance);
    }

    public readFromLocalStorage() {
        this._apiTokenInstance = localStorage.getItem(LOCAL_STORAGE_KEY_API_TOKEN_INSTANCE) ?? '';
        this._idInstance = localStorage.getItem(LOCAL_STORAGE_KEY_ID_INSTANCE) ?? '';
    }

    get isAuth(): boolean {
        return !!(this._apiTokenInstance && this._idInstance);
    }

    constructor() {
        this.logOut = this.logOut.bind(this);
        this.saveInLocalStorage = this.saveInLocalStorage.bind(this);
        this.readFromLocalStorage = this.readFromLocalStorage.bind(this);

        this._apiTokenInstance = localStorage.getItem(LOCAL_STORAGE_KEY_API_TOKEN_INSTANCE) ?? '';
        this._idInstance = localStorage.getItem(LOCAL_STORAGE_KEY_ID_INSTANCE) ?? '';

        makeObservable<this,
            '_apiTokenInstance'
            | '_idInstance'
        >(this, {
            _apiTokenInstance: observableRef,
            _idInstance: observableRef,
            apiTokenInstance: computed,
            idInstance: computed,
            isAuth: computed,
        });
    }
}

export const storeAuthData = new StoreAuthData();
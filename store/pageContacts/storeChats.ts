import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { type TelegramChat } from "../../api/api"

export class StoreChats {
    private _chatsList: TelegramChat[];
    private _isLoading: boolean;
    private _errorText: string | null;

    //#region chatsList
    get chatsList() {
        return this._chatsList;
    }

    set chatsList(value: TelegramChat[]) {
        runInAction(() => {
            this._chatsList = value;
        });
    }
    //#endregion

    //#region isLoading
    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value: boolean) {
        runInAction(() => {
            this._isLoading = value;
        });
    }
    //#endregion

    //#region errorText
    get errorText() {
        return this._errorText;
    }

    set errorText(value: string | null) {
        runInAction(() => {
            this._errorText = value;
        });
    }
    //#endregion

    constructor() {
        this._chatsList = [];
        this._isLoading = false;
        this._errorText = null;

        makeObservable<this,
            '_chatsList'
            | '_isLoading'
            | '_errorText'
        >(this, {
            _chatsList: observableRef,
            _isLoading: observableRef,
            _errorText: observableRef,
            chatsList: computed,
            isLoading: computed,
            errorText: computed
        });
    }
}
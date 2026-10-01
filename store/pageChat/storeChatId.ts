import { computed, makeObservable, observableRef, runInAction } from "mobx";

export class StoreChatId {
    private _chatId: string | null;

    get chatId() {
        return this._chatId;
    }

    set chatId(value: string | null) {
        runInAction(() => {
            this._chatId = value;
        });
    }

    constructor(chatId: string | null) {
        this._chatId = chatId;

        makeObservable<this, '_chatId'>(this, {
            _chatId: observableRef,
            chatId: computed,
        });
    }
}
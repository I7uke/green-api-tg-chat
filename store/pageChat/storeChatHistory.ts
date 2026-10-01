import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { type TelegramMessage } from "../../api/api";

export class StoreChatHistory {
    private _messages: TelegramMessage[];
    private _isLoading: boolean;
    private _errorText: string | null;
    private _messagesId: Set<string>;
    private _lastUpdate: number;

    //#region messages
    get messages() {
        return this._messages;
    }

    public setMessages(value: TelegramMessage[]) {
        // Специально берем только текстовые и не удаленные сообщения
        const validMessages = value.filter(m => !m.isDeleted && m.typeMessage === 'textMessage');
        const reverse = validMessages.reverse();
        const messagesId = reverse.map(m => m.idMessage);
        this._messagesId = new Set(messagesId);

        runInAction(() => {
            this._messages = reverse;
            this._lastUpdate = +new Date();
        });
    }

    public addNewMessage(newMessage: TelegramMessage) {
        if (this._messagesId.has(newMessage.idMessage)) {
            // В рамках тестового, работаем только с новыми сообщениями
            return;
        }

        const copyMessagesList = [...this._messages, newMessage];

        runInAction(() => {
            this._messages = copyMessagesList;
            this._lastUpdate = +new Date();
        });
    }

    get lastUpdate() {
        return this._lastUpdate;
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
        this._messages = [];
        this._isLoading = false;
        this._errorText = null;
        this._messagesId = new Set();
        this._lastUpdate = +new Date(); 

        makeObservable<this,
            '_messages'
            | '_isLoading'
            | '_errorText'
            | '_lastUpdate'
        >(this, {
            _messages: observableRef,
            _isLoading: observableRef,
            _errorText: observableRef,
            _lastUpdate: observableRef,
            messages: computed,
            isLoading: computed,
            errorText: computed,
            lastUpdate: computed
        });
    }
}
import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { apiPostSendMessage, type TelegramMessage } from "../../api/api";
import { StoreInputText } from "../storeInputText";
import { type ValidationValueResult } from "../../models/validationValueResult";
import { storeAuthData } from "../global/storeAuthData";

function validationValue(value: string | null | undefined): ValidationValueResult<string> {
    if (typeof value !== 'string') {
        return ({
            errorText: 'Некорректный ввод',
            validValue: null
        })
    }

    if (!value) {
        return ({
            errorText: 'Поле не может быть пустым',
            validValue: null
        })
    }

    return ({
        errorText: null,
        validValue: value
    });
}

export class StoreChatHistory {
    private _messagesList: TelegramMessage[];
    private _isLoadingMessages: boolean;
    private _errorText: string | null;
    private _messagesId: Set<string>;
    private _lastUpdate: number;
    private readonly _chatId: string;

    public storeInputText: StoreInputText;

    //#region messagesList
    get messagesList() {
        return this._messagesList;
    }

    public setMessages(value: TelegramMessage[]) {
        // Специально берем только текстовые и не удаленные сообщения
        const validMessages = value.filter(m => !m.isDeleted && m.typeMessage === 'textMessage');
        const reverse = validMessages.reverse();
        const messagesId = reverse.map(m => m.idMessage);
        this._messagesId = new Set(messagesId);

        runInAction(() => {
            this._messagesList = reverse;
            this._lastUpdate = +new Date();
        });
    }

    public addNewMessage(newMessage: TelegramMessage) {
        if (this._messagesId.has(newMessage.idMessage)) {
            // В рамках тестового, работаем только с новыми сообщениями
            return;
        }

        const copyMessagesList = [...this._messagesList, newMessage];

        runInAction(() => {
            this._messagesList = copyMessagesList;
            this._lastUpdate = +new Date();
        });
    }

    get lastUpdate() {
        return this._lastUpdate;
    }

    //#endregion

    //#region isLoadingMessages
    get isLoadingMessages() {
        return this._isLoadingMessages;
    }

    set isLoadingMessages(value: boolean) {
        runInAction(() => {
            this._isLoadingMessages = value;
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

    public eventSendMessage() {
        const validMessage = this.storeInputText.validation();

        if (validMessage.errorText !== null) {
            return;
        }

        this.storeInputText.startLoading();

        const newMessageText = validMessage.validValue;
        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;

        apiPostSendMessage(idInstance, apiTokenInstance, this._chatId, newMessageText)
            .then((response) => {
                this.storeInputText.resetValue();
                this.storeInputText.resetError();
                const idMessage = response.idMessage;

                const newMessage: TelegramMessage = {
                    chatId: this._chatId,
                    idMessage: idMessage,
                    typeMessage: 'textMessage',
                    type: 'outgoing',
                    textMessage: newMessageText,
                    timestamp: Math.floor(+new Date() / 1000)
                }

                const copyMessagesList = [...this._messagesList, newMessage];

                runInAction(() => {
                    this._messagesList = copyMessagesList;
                    this._lastUpdate = +new Date();
                });
            })
            .catch(() => {
                this.storeInputText.setError('При отправке сообщения возникла ошибка');
            })
            .finally(() => {
                this.storeInputText.stopLoading();
                this.storeInputText.isDisabled = false;
            });



        this.storeInputText.isDisabled = true;
    }

    constructor(chatId: string) {
        this.eventSendMessage = this.eventSendMessage.bind(this);

        this._chatId = chatId;
        this._messagesList = [];
        this._isLoadingMessages = false;
        this._errorText = null;
        this._messagesId = new Set();
        this._lastUpdate = +new Date();
        this.storeInputText = new StoreInputText({
            validValue: validationValue,
            isResetErrorOnChangeValue: true
        });

        makeObservable<this,
            '_messagesList'
            | '_isLoadingMessages'
            | '_errorText'
            | '_lastUpdate'
        >(this, {
            _messagesList: observableRef,
            _isLoadingMessages: observableRef,
            _errorText: observableRef,
            _lastUpdate: observableRef,
            messagesList: computed,
            isLoadingMessages: computed,
            errorText: computed,
            lastUpdate: computed
        });
    }
}
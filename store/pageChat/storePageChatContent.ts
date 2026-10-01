import { apiDeleteNotification, apiPostChatHistory, apiReceiveNotification } from "../../api/api";
import type { PageContent } from "../../models/pageContent";
import { storeAuthData } from "../global/storeAuthData";
import { StoreChatHistory } from "./storeChatHistory";

export class StorePageChatContent implements PageContent {
    private _chatId: string | null;
    private _abortControllerNotification: AbortController | null;
    private _isDispose: boolean;

    public readonly storeChatHistory: StoreChatHistory;

    public dispose(): void {
        if (this._abortControllerNotification) {
            this._abortControllerNotification.abort();
        }

        this._abortControllerNotification = null;
        this._isDispose = true;
    }

    //#region serverRequest
    public serverRequestNotification() {
        if (!this._chatId) {
            return;
        }

        if (this._isDispose) {
            return;
        }

        if(this._abortControllerNotification) {
            this._abortControllerNotification.abort();
        }

        this._abortControllerNotification = new AbortController();
        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;

        apiReceiveNotification(idInstance, apiTokenInstance, 50, this._abortControllerNotification.signal)
            .then((response) => {
                const notification = response.data;
                console.log(notification);

                const receiptId = notification?.receiptId;

                if(!receiptId) {
                    this.serverRequestNotification();
                    return;
                }

                apiDeleteNotification(idInstance, apiTokenInstance, receiptId)
                    .finally(() => {
                        this.storeChatHistory.addNewMessage({
                            chatId: this._chatId ?? '',
                            idMessage: notification.body.idMessage,
                            timestamp: notification.body.timestamp,
                            type: 'incoming',
                            typeMessage: notification.body.messageData?.typeMessage ?? 'textMessage',
                            textMessage: notification.body.messageData?.textMessageData?.textMessage ?? ''
                        });
                        this.serverRequestNotification();
                    });
            })
            .catch(() => {
                this.serverRequestNotification();
            });
    }

    public serverRequestChatHistory() {
        if (!this._chatId) {
            return;
        }

        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;
        this.storeChatHistory.isLoading = true;
        apiPostChatHistory(idInstance, apiTokenInstance, this._chatId, 100)
            .then((response) => {
                console.log(response.data)
                this.storeChatHistory.setMessages(response.data);
            })
            .finally(() => {
                this.storeChatHistory.isLoading = false;
            });
    }
    //#endregion


    constructor(chatId: string | null) {
        this._chatId = chatId;
        this._isDispose = false;
        this._abortControllerNotification = null;
        this.storeChatHistory = new StoreChatHistory();

    }
}
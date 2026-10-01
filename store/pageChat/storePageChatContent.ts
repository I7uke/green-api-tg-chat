import { apiDeleteNotification, apiPostChatHistory, apiReceiveNotification } from "../../api/api";
import type { PageContent } from "../../models/pageContent";
import { storeAuthData } from "../global/storeAuthData";
import { StoreChatByPhone } from "./storeChatByPhone";
import { StoreChatHistory } from "./storeChatHistory";
import { StoreChatId } from "./storeChatId";

export class StorePageChatContent implements PageContent {
    private _abortControllerNotification: AbortController | null;
    private _isDispose: boolean;

    public storeChatId: StoreChatId;
    public readonly storeChatHistory: StoreChatHistory;
    public readonly storeChatByPhone: StoreChatByPhone;

    public dispose(): void {
        if (this._abortControllerNotification) {
            this._abortControllerNotification.abort();
        }

        this._abortControllerNotification = null;
        this._isDispose = true;
    }

    //#region serverRequest
    public serverRequestNotification() {
        const chatId: string | null = this.storeChatId.chatId;

        if (!chatId) {
            return;
        }

        if (this._isDispose) {
            return;
        }

        if (this._abortControllerNotification) {
            this._abortControllerNotification.abort();
        }

        this._abortControllerNotification = new AbortController();
        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;

        apiReceiveNotification(idInstance, apiTokenInstance, 50, this._abortControllerNotification.signal)
            .then((response) => {
                const notification = response.data;

                const receiptId = notification?.receiptId;

                if (!receiptId) {
                    this.serverRequestNotification();
                    return;
                }

                apiDeleteNotification(idInstance, apiTokenInstance, receiptId)
                    .then(() => {
                        this.storeChatHistory.addNewMessage({
                            chatId: chatId ?? '',
                            idMessage: notification.body.idMessage,
                            timestamp: notification.body.timestamp,
                            type: 'incoming',
                            typeMessage: notification.body.messageData?.typeMessage ?? 'textMessage',
                            textMessage: notification.body.messageData?.textMessageData?.textMessage ?? ''
                        });

                        this.serverRequestNotification();
                    })
                    .catch(() => {
                        // Если сервис не доступен, чтобы не сыпались запросы
                        setTimeout(() => {
                            this.serverRequestNotification();
                        }, 5000);
                    });
            })
            .catch(() => {
                // Если сервис не доступен, чтобы не сыпались запросы
                setTimeout(() => {
                    this.serverRequestNotification();
                }, 5000);
            });
    }

    public serverRequestChatHistory() {
        const chatId: string | null = this.storeChatId.chatId;

        if (!chatId) {
            return;
        }

        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;
        this.storeChatHistory.isLoadingMessages = true;
        apiPostChatHistory(idInstance, apiTokenInstance, chatId, 100)
            .then((response) => {
                this.storeChatHistory.setMessages(response.data);
            })
            .finally(() => {
                this.storeChatHistory.isLoadingMessages = false;
            });
    }
    //#endregion


    constructor(chatId: string | null) {
        this._isDispose = false;
        this._abortControllerNotification = null;
        this.storeChatId = new StoreChatId(chatId);
        this.storeChatHistory = new StoreChatHistory(this.storeChatId);
        this.storeChatByPhone = new StoreChatByPhone(this.storeChatId);
    }
}
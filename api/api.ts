import axios from "axios";

//#region stateInstance

export type StateInstance =
    | "authorized"
    | "notAuthorized"
    | "blocked"
    | "starting"
    | "suspended"
    | "pendingPassword";

export interface GetStateInstanceResponse {
    readonly stateInstance: StateInstance;
}

export function apiGetStateInstance(idInstance: string, apiTokenInstance: string) {
    return axios.get<GetStateInstanceResponse>(
        `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
    );
}

//#endregion

//#region getChats

export interface TelegramChat {
    readonly chatId: string;
    readonly name: string;
    readonly type: 'user' | 'group' | 'supergroup' | 'channel';
    readonly phoneNumber?: number;
    readonly username?: string;
}

export function apiGetChats(idInstance: string, apiTokenInstance: string) {
    return axios.get<TelegramChat[]>(
        `https://api.green-api.com/waInstance${idInstance}/getChats/${apiTokenInstance}`
    );
}

//#endregion

//#region chatHistory

export interface TelegramMessage {
    readonly type: 'incoming' | 'outgoing';
    readonly idMessage: string;
    readonly timestamp: number;
    readonly typeMessage: string;
    readonly chatId: string;
    readonly textMessage?: string;
    readonly senderName?: string;
    readonly senderContactName?: string;
    readonly chatType?: 'user' | 'group' | 'supergroup' | 'channel' | 'bot';
    readonly statusMessage?: 'delivered' | 'read';
    readonly sendByApi?: boolean;
    readonly isEdited?: boolean;
    readonly isDeleted?: boolean;
}

export function apiPostChatHistory(idInstance: string, apiTokenInstance: string, chatId: string, messagesCount: number) {
    return axios.post<TelegramMessage[]>(
        `https://api.green-api.com/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
        {
            chatId: chatId,
            count: messagesCount,
        },
    );
}

//#endregion


//#region receiveNotification

export interface GreenApiNotification {
    readonly receiptId: number;
    readonly body: GreenApiNotificationBody;
}

export interface GreenApiNotificationBody {
    readonly typeWebhook: string;
    readonly idMessage: string;
    readonly timestamp: number;
    readonly senderData?: {
        readonly chatId: string;
        readonly chatName?: string;
        readonly sender?: string;
        readonly senderName?: string;
    };
    readonly messageData?: {
        readonly typeMessage: string;
        readonly textMessageData?: {
            textMessage: string;
        };
    };
}

export async function apiReceiveNotification(idInstance: string, apiTokenInstance: string, receiveTimeout: number, signal: AbortSignal) {
    return axios.get<GreenApiNotification | null>(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`, {
        params: {
            receiveTimeout: receiveTimeout,
        },
        signal: signal
    });
}

//#endregion


export async function apiDeleteNotification(idInstance: string, apiTokenInstance: string, receiptId: number
) {
    return axios.delete<boolean>(
        `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
    );
}
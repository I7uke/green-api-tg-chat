import { apiPostCheckAccount } from "../../api/api";
import { type ValidationValueResult } from "../../models/validationValueResult";
import { storeAuthData } from "../global/storeAuthData";
import { StoreInputText } from "../storeInputText";
import { StoreChatId } from "./storeChatId";

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

    const phone = Number(value);

    if (isNaN(phone)) {
        return ({
            errorText: 'Некорректный номер',
            validValue: null
        })
    }

    return ({
        errorText: null,
        validValue: value
    });
}

export class StoreChatByPhone {
    public readonly storeInputText: StoreInputText;
    private readonly _storeChatId: StoreChatId;

    public eventCheckNumber() {
        const validNumber = this.storeInputText.validation();

        if (validNumber.errorText !== null) {
            return;
        }

        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;
        const phone = Number(validNumber.validValue);

        this.storeInputText.isDisabled = true;
        this.storeInputText.startLoading();

        apiPostCheckAccount(idInstance, apiTokenInstance, phone)
            .then((response) => {
                const exist = response.data.exist;
                const chatId = response.data.chatId;

                if (!exist) {
                    this.storeInputText.setError('У пользователя нет аккаунта Telegram');
                    return;
                }

                if (!chatId) {
                    this.storeInputText.setError('Получен некорректный id чата');
                    return;
                }

                this._storeChatId.chatId = response.data.chatId;
                this.storeInputText.resetError();
                this.storeInputText.resetValue();
            })
            .catch(() => {
                this.storeInputText.setError('Во время запроса возникла ошибка');
            })
            .finally(() => {
                this.storeInputText.isDisabled = false;
                this.storeInputText.stopLoading();
            });
    }

    constructor(storeChatId: StoreChatId) {
        this.eventCheckNumber = this.eventCheckNumber.bind(this);

        this._storeChatId = storeChatId;

        this.storeInputText = new StoreInputText({
            isResetErrorOnChangeValue: true,
            placeholder: 'Телефон',
            validValue: validationValue
        });
    }

}
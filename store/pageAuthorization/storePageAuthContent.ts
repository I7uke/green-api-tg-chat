import { apiGetStateInstance } from "../../api/api";
import type { PageContent } from "../../models/pageContent";
import type { ValidationValueResult } from "../../models/validationValueResult";
import { storeAuthData } from "../global/storeAuthData";
import { StoreErrorText } from "../storeErrorText";
import { StoreInputText } from "../storeInputText";
import { StoreLoading } from "../storeLoading";

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

export class StorePageAuthContent implements PageContent {
    public readonly storeIdInstance: StoreInputText;
    public readonly storeApiTokenInstance: StoreInputText;
    public readonly serverError: StoreErrorText;
    public readonly serverRequest: StoreLoading;

    public dispose(): void {
        this.storeIdInstance.dispose();
        this.storeApiTokenInstance.dispose();
    }

    public eventLogin() {
        const idInstance = this.storeIdInstance.validation();
        const apiTokenInstance = this.storeApiTokenInstance.validation();

        if (typeof idInstance.errorText === 'string' || typeof apiTokenInstance.errorText === 'string') {
            return;
        }

        this.serverRequest.startLoading();
        this.storeIdInstance.isDisabled = true;
        this.storeApiTokenInstance.isDisabled = true;

        apiGetStateInstance(idInstance.validValue, apiTokenInstance.validValue)
            .then((response) => {
                const stateInstance = response.data.stateInstance;

                if (stateInstance === 'notAuthorized') {
                    this.serverError.errorText = 'Telegram не авторизован';
                    return;
                }
                if (stateInstance === 'blocked') {
                    this.serverError.errorText = 'Инстанс заблокирован';
                    return
                }

                if (stateInstance === 'starting') {
                    this.serverError.errorText = 'Инстанс запускается, пожалуйста подождите';
                    return;
                }

                if (stateInstance === 'suspended') {
                    this.serverError.errorText = 'Инстанс временно приостановлен';
                    return;
                }

                if (stateInstance === 'pendingPassword') {
                    this.serverError.errorText = 'Требуется пароль двухфакторной аутентификации';
                    return;
                }

                storeAuthData.apiTokenInstance = apiTokenInstance.validValue;
                storeAuthData.idInstance = idInstance.validValue;
                storeAuthData.saveInLocalStorage();
            })
            .catch(() => {
                this.serverError.errorText = 'Во время выполнения запроса возникла ошибка';
            })
            .finally(() => {
                this.serverRequest.stopLoading();
                this.storeIdInstance.isDisabled = false;
                this.storeApiTokenInstance.isDisabled = false;
            });
    }

    constructor() {
        this.eventLogin = this.eventLogin.bind(this);

        this.serverError = new StoreErrorText();
        this.serverRequest = new StoreLoading();

        this.storeIdInstance = new StoreInputText({
            isResetErrorOnChangeValue: true,
            placeholder: 'idInstance',
            title: 'idInstance',
            validValue: validationValue,
            eventGetChangeValue: () => {
                this.serverError.resetError();
            }
        });

        this.storeApiTokenInstance = new StoreInputText({
            isResetErrorOnChangeValue: true,
            placeholder: 'apiTokenInstance',
            title: 'apiTokenInstance',
            inputType: 'password',
            validValue: validationValue,
            eventGetChangeValue: () => {
                this.serverError.resetError();
            }
        });
    }
}
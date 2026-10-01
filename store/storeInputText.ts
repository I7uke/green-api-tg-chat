import React from "react";
import { computed, makeObservable, observableRef, runInAction } from "mobx";
import { type ValidationValueResult } from "../models/validationValueResult";

type ValidValue = (value: string | null | undefined) => ValidationValueResult<string>;
type EventGetChangeValue = (value: string) => void;
type InputType = 'text' | 'password';

interface InitData {
    readonly value?: string;
    readonly placeholder?: string;
    readonly isResetErrorOnChangeValue?: boolean;
    readonly validValue: ValidValue;
    readonly eventGetChangeValue?: EventGetChangeValue;
    readonly isDisabled?: boolean;
    readonly inputType?: InputType;
    readonly title?: string;
}

export class StoreInputText {
    private _value: string;
    private _errorText: string | undefined;
    private readonly _isResetErrorOnChangeValue: boolean;
    private readonly _placeholder: string | undefined;
    private _validValue: ValidValue | null;
    private _eventGetChangeValue: EventGetChangeValue | null;
    private _isDisabled: boolean | undefined;
    private readonly _inputType: InputType | undefined;
    private readonly _title: string | undefined;
    private _isLoading: boolean;

    public eventChangeValue(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) {
        const newValue = e.currentTarget.value;

        runInAction(() => {
            this._value = newValue;
            if (this._isResetErrorOnChangeValue) {
                if (this._errorText) {
                    this._errorText = undefined;
                }
            }
        });

        if (typeof this._eventGetChangeValue === 'function') {
            this._eventGetChangeValue(newValue);
        }
    }

    public resetError() {
        runInAction(() => {
            this._errorText = undefined;
        });
    }

    public setError(value: string) {
        runInAction(() => {
            this._errorText = value;
        });
    }

    public validation(): ValidationValueResult<string> {
        if (typeof this._validValue !== 'function') {
            throw new Error('Validator not set');
        }

        const validResult = this._validValue(this._value);

        if (validResult.errorText) {
            runInAction(() => {
                this._errorText = validResult.errorText;
            });
        }

        return validResult;
    }

    public resetValue() {
        runInAction(() => {
            this._value = '';
        });
    }

    public dispose() {
        this._validValue = null;
        this._eventGetChangeValue = null;
    }

    public startLoading() {
        runInAction(() => {
            this._isLoading = true;
        });
    }

    stopLoading() {
        runInAction(() => {
            this._isLoading = false;
        });
    }

    get value() {
        return this._value;
    }

    get errorText() {
        return this._errorText;
    }

    get placeholder() {
        return this._placeholder;
    }

    get isDisabled() {
        return this._isDisabled;
    }

    get inputType() {
        return this._inputType;
    }

    get title() {
        return this._title;
    }

    get isLoading() {
        return this._isLoading;
    }

    set isDisabled(value: boolean | undefined) {
        runInAction(() => {
            this._isDisabled = value;
        });
    }

    constructor(initData: InitData) {
        this.eventChangeValue = this.eventChangeValue.bind(this);

        this._value = initData.value ?? '';
        this._isResetErrorOnChangeValue = !!initData.isResetErrorOnChangeValue;
        this._placeholder = initData.placeholder;
        this._validValue = typeof initData.validValue === 'function' ? initData.validValue : null;
        this._eventGetChangeValue = typeof initData.eventGetChangeValue === 'function' ? initData.eventGetChangeValue : null;
        this._errorText = undefined;
        this._isDisabled = initData.isDisabled;
        this._inputType = initData.inputType;
        this._title = initData.title;
        this._isLoading = false;

        makeObservable<this,
            | '_value'
            | '_errorText'
            | '_isDisabled'
            | '_isLoading'>(this, {
                _value: observableRef,
                _errorText: observableRef,
                _isDisabled: observableRef,
                _isLoading: observableRef,
                errorText: computed,
                value: computed,
                isDisabled: computed,
                isLoading: computed
            });
    }
}
import React from "react";
import styles from './styles.scss';

interface Props {
    readonly value?: string | undefined;
    readonly errorText?: string | undefined;
    readonly eventChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly placeholder?: string | undefined;
    readonly isDisabled?: boolean | undefined;
    readonly type?: 'text' | 'password' | undefined;
    readonly title?: string | undefined;
}

export default function AuthInput(props: Props) {
    const cssClassStatus = props.errorText ? styles.authInputError : styles.authInputNormal;
    return (
        <div className={styles.componentContainer}>
            <input
                placeholder={props.placeholder}
                title={props.title}
                className={`${styles.authInput} ${cssClassStatus}`}
                value={props.value}
                type={props.type}
                disabled={props.isDisabled}
                onChange={props.eventChange}
            />

            {props.errorText ? <div className={styles.errorTextContainer}>{props.errorText}</div> : null}
        </div>
    );

}

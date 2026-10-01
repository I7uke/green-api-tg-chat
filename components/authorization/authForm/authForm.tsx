import { observer } from 'mobx-react';
import type { WithStore } from '../../../models/withStore';
import { StoreInputText } from '../../../store/storeInputText';
import AuthInput from '../authInput/authInput';
import styles from './styles.scss';
import { StorePageAuthContent } from '../../../store/pageAuthorization/storePageAuthContent';
import { StoreErrorText } from '../../../store/storeErrorText';
import { SpinnerSimple } from '../../loader';

const TEXT_TITLE_FORM = 'Авторизация';
const TEXT_BUTTON = 'Войти';

const SmartAuthInput = observer((props: WithStore<StoreInputText>) =>
    <AuthInput
        placeholder={props.store.placeholder}
        title={props.store.title}
        eventChange={props.store.eventChangeValue}
        errorText={props.store.errorText}
        value={props.store.value}
        isDisabled={props.store.isDisabled}
    />
);

const SmartServerError = observer((props: WithStore<StoreErrorText>) => {
    if (!props.store.errorText) {
        return null;
    }

    return (<div className={styles.serverTextErrorContainer}>{props.store.errorText}</div>);
});

const SmartButtons = observer((props: WithStore<StorePageAuthContent>) => {
    if (props.store.serverRequest.isLoading) {
        return (
            <div className={styles.authButtonLoading}>
                <SpinnerSimple borderWidth={'4px'} padding={'10px'} />
            </div>
        );
    }

    return (
        <div>
            <button onClick={props.store.eventLogin} className={styles.authButton}>
                {TEXT_BUTTON}
            </button>
        </div>
    );
});


export default function AuthForm(props: WithStore<StorePageAuthContent>) {
    return (
        <div className={styles.componentContainer}>
            <div className={styles.formTitleContainer}>{TEXT_TITLE_FORM}</div>
            <SmartAuthInput store={props.store.storeIdInstance} />
            <SmartAuthInput store={props.store.storeApiTokenInstance} />
            <SmartButtons store={props.store} />
            <SmartServerError store={props.store.serverError} />
        </div>
    );
}
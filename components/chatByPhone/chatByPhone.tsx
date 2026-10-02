import { observer } from "mobx-react";
import { type WithStore } from "../../models/withStore";
import { StoreChatByPhone } from "../../store/pageChat/storeChatByPhone";
import { StoreInputText } from "../../store/storeInputText";
import { SpinnerSimple } from "../loader";
import styles from "./styles.scss";

const TEXT_CAPTION: string = 'Введите номер телефона:';
const TEXT_BUTTON: string = 'Перейти в чат';

const SmartInputPhone = observer((props: WithStore<StoreInputText>) =>
    <input
        className={styles.inputPhone}
        placeholder={props.store.placeholder}
        title={props.store.title}
        onChange={props.store.eventChangeValue}
        value={props.store.value}
        disabled={props.store.isDisabled}
    />
);

const SmartButton = observer((props: WithStore<StoreChatByPhone>) => {
    if (props.store.storeInputText.isLoading) {
        return (<SpinnerSimple padding={'14px'} />);
    }

    return (
        <button onClick={props.store.eventCheckNumber} className={styles.buttonPhone}>
            {TEXT_BUTTON}
        </button>
    );
});

const SmartErrorText = observer((props: WithStore<StoreInputText>) => {
    if (!props.store.errorText) {
        return null;
    }

    return (<div className={styles.errorText}>{props.store.errorText}</div>);
});

export default function ChatByPhone(props: WithStore<StoreChatByPhone>) {
    return (
        <div>
            <div className={styles.phoneTitleContainer}>{TEXT_CAPTION}</div>
            <SmartInputPhone store={props.store.storeInputText} />
            <div className={styles.buttonContainer}>
                <SmartButton store={props.store} />
            </div>
            <SmartErrorText store={props.store.storeInputText}/>
        </div>
    );
}
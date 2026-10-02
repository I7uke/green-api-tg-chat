import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { type TelegramMessage } from '../../api/api';
import { type WithStore } from '../../models/withStore';
import { StoreChatHistory } from '../../store/pageChat/storeChatHistory';
import { SpinnerSimple } from '../loader';
import { StoreInputText } from '../../store/storeInputText';
import SvgImagePaperPlane from '../../img/svg_ico/paperPlane.svg';
import styles from './styles.scss';

const TEXT_BUTTON_SEND = 'Отправить';

interface MessageProps {
    readonly message: TelegramMessage;
}

function getValidDate(timestamp: number | null | undefined): string {
    const defaultValue = '-';

    if (typeof timestamp !== 'number') {
        return defaultValue;
    }

    if (isNaN(timestamp)) {
        return defaultValue;
    }

    if (timestamp <= 0) {
        return defaultValue;
    }

    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

function Message(props: MessageProps) {
    const cssMessageType = props.message.type === 'incoming' ? styles.chatMessageIncoming : styles.chatMessageOutgoing;
    const cssMessageContainer = props.message.type === 'incoming' ? styles.messageContainerIncoming : styles.messageContainerOutgoing;
    const dateString = getValidDate(props.message.timestamp);
    return (
        <div className={`${styles.messageContainer} ${cssMessageContainer}`}>
            <div className={`${styles.chatMessage} ${cssMessageType}`}>
                <div>{props.message?.textMessage ?? ''}</div>
                <div className={styles.messageDateContainer}>{dateString}</div>
            </div>
        </div>
    );
}

const SmartMessagesList = observer((props: WithStore<StoreChatHistory>) => {
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const element = chatMessagesRef.current;

        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }, [props.store.lastUpdate]);

    return (
        <div ref={chatMessagesRef} className={styles.chatMessages}>
            {props.store.messagesList.map((m => <Message key={m.idMessage} message={m} />))}
        </div>
    );
});

const SmartInput = observer((props: WithStore<StoreInputText>) =>
    <div>
        <textarea className={styles.inputMessage}
            disabled={props.store.isDisabled}
            value={props.store.value}
            onChange={props.store.eventChangeValue}
        />
        { props.store.errorText ?  <div className={styles.errorText}>{props.store.errorText}</div> : null }
    </div>
);

const SmartButton = observer((props: WithStore<StoreChatHistory>) => {
    if (props.store.storeInputText.isLoading) {
        return (<SpinnerSimple />);
    }

    return (
        <button
            onClick={props.store.eventSendMessage}
            title={TEXT_BUTTON_SEND}
            className={styles.sendButton}>
            <SvgImagePaperPlane />
        </button>
    );
});

export default function Chat(props: WithStore<StoreChatHistory>) {
    return (
        <div className={styles.chatContainer}>
            <SmartMessagesList store={props.store} />
            <div className={styles.inputContainer}>
                <SmartInput store={props.store.storeInputText} />
                <div className={styles.buttonContainer}>
                    <SmartButton store={props.store} />
                </div>
            </div>
        </div>
    );
}
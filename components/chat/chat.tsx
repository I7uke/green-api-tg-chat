import { observer } from 'mobx-react';
import { type TelegramMessage } from '../../api/api';
import SvgImagePaperPlane from '../../img/svg_ico/paperPlane.svg';
import { type WithStore } from '../../models/withStore';
import { StoreChatHistory } from '../../store/pageChat/storeChatHistory';
import styles from './styles.scss';
import { useEffect, useRef } from 'react';

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
            {props.store.messages.map((m => <Message key={m.idMessage} message={m} />))}
        </div>
    );
});

export default function Chat(props: WithStore<StoreChatHistory>) {
    return (
        <div className={styles.chatContainer}>
            <SmartMessagesList store={props.store} />
            <div className={styles.inputContainer}>
                <textarea className={styles.inputMessage} />
                <div className={styles.buttonContainer}>
                    <button title={TEXT_BUTTON_SEND} className={styles.sendButton}>
                        <SvgImagePaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
}
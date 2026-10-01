import { Link } from "react-router-dom";
import { type TelegramChat } from "../../api/api";
import SvgImageComments from '../../img/svg_ico/comments.svg';
import { sitePages } from "../../staticData/sitePages";
import styles from "./styles.scss";

interface PropsContact {
    readonly contact: TelegramChat;
}

interface PropsLine {
    readonly value: string | number | null | undefined;
    readonly caption: string;
}

function Line(props: PropsLine) {
    let value: string | number = '-';

    if (props.value) {
        value = props.value
    }

    return(
        <div className={styles.line}>
            <span className={styles.caption}>{props.caption}</span>
            <span>{value}</span>
        </div>
    );
}

export default function Contact(props: PropsContact) {
    return (
        <div className={styles.componentContainer}>
            <div>
                <Line caption={'Имя пользователя: '} value={props.contact.name}/>
                <Line caption={'Номер телефона: '} value={props.contact.phoneNumber}/>
                <Line caption={'username: '} value={props.contact.username}/>
            </div>
            <div className={styles.chatButtonContainer}>
                <Link title={'Перейти в чат'} className={styles.chatLink} to={`${sitePages.chat}?chatId=${props.contact.chatId}`}><SvgImageComments/></Link>
            </div>
        </div>
    );
}
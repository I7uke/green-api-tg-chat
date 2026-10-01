import { Link } from "react-router-dom";
import styles from "./styles.scss";

interface Props {
    readonly link: string;
    readonly text: string;
}

export default function LinkButton(props: Props) {
    return (
        <div className={styles.componentContainer}>
            <Link className={styles.linkButton} to={props.link}>{props.text}</Link>
        </div>
    );
}
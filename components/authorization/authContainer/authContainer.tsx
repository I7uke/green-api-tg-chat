import { type ReactNode } from "react";
import styles from './styles.scss';

interface Props {
    children: ReactNode;
}

export default function AuthContainer(props: Props) {
    return (
        <div className={styles.componentContainer}>
            {props.children}
        </div>
    );
}
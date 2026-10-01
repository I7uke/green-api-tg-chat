import styles from './styles.scss';

interface Props {
    readonly padding?: string | number;
    readonly borderWidth?: string | number;
}

export default function SpinnerSimple(props: Props) {
    return <div style={{ padding: props.padding, borderWidth: props.borderWidth }} className={styles.componentContainer} />
}
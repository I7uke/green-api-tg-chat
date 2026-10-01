import { LottieDisplay, useLottie } from "lottie-react";
import lottieAnimationErrorPage404 from '../../lottieAnimation/errorPage404.json';
import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import styles from './styles.scss';
import type { WithStore } from "../../models/withStore";
import { storeCurrentPageInfo } from "../../store/global/storeCurrentPageInfo";

const TEXT_PAGE_NOT_FOUND: string = 'Страница не найдена';
const TEXT_LINK_GO_HOME: string = 'Главная';

const SmartLinkBack = observer(() =>
    <Link className={styles.homeLink} to={storeCurrentPageInfo.linkBack}>
        {TEXT_LINK_GO_HOME}
    </Link>
);

export default function Error404() {
    const lottieInstance = useLottie({
        src: lottieAnimationErrorPage404,
        autoplay: true,
        loop: true
    });

    useLayoutEffect(() => {
        const timerID = setTimeout(() => {
            lottieInstance.play();
        }, 0)

        return () => {
            clearTimeout(timerID);
        }
    }, []);

    return (<div className={styles.componentContainer}>
        <div className={styles.animationContainer}>
            <LottieDisplay lottie={lottieInstance} />
        </div>
        <div className={styles.textContainer}>
            <div>{TEXT_PAGE_NOT_FOUND}</div>
            <div>
                <SmartLinkBack/>
            </div>
        </div>
    </div>);
}
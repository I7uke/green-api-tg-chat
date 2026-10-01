import { Link, Outlet } from "react-router-dom";
import { storeCurrentPageInfo } from "../../../store/global/storeCurrentPageInfo";
import { observer } from "mobx-react";
import styles from "./styles.scss";
import SvgImageAngleLeft from '../../../img/svg_ico/angleLeft.svg';
import { storeAuthData } from "../../../store/global/storeAuthData";

const TEXT_BUTTON_LOGOUT = 'Выход';
const TEXT_LINK_BACK = 'Назад';

const SmartHeader = observer(() =>
    <header className={styles.header}>
        <div>
            {
                storeCurrentPageInfo.linkBack ? 
                <Link
                    to={storeCurrentPageInfo.linkBack}
                    title={TEXT_LINK_BACK}
                    className={styles.linkBack}>
                    <SvgImageAngleLeft />
                </Link> : null
            }
        </div>
        <div className={styles.headerTitle}>
            <span> {storeCurrentPageInfo.pageTitle ? storeCurrentPageInfo.pageTitle : null}</span>
        </div>
        <div>
            <span className={styles.logOut} onClick={storeAuthData.logOut}>
                {TEXT_BUTTON_LOGOUT}
            </span>
        </div>
    </header>
);

export default function TemplateAuthPage() {
    return (
        <div className={styles.componentContainer}>
            <SmartHeader />
            <div className={styles.contentContainer}>
                {/* <div className={styles.contentPanel}> */}
                    <Outlet />
                {/* </div> */}
            </div>
        </div>
    );
}
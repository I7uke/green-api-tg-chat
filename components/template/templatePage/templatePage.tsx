import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { LoaderPage } from "../../loader";
import styles from "./styles.scss";

export default function TemplatePage() {
    return (
        <Suspense fallback={<LoaderPage />}>
            <div className={styles.imageBackground} />
            <Outlet />
        </Suspense>
    );
}
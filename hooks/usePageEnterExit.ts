import { useEffect } from "react";
import { AbstractStorePage } from "../store/base/abstractStorePage";

export function usePageEnterExit<T extends AbstractStorePage>(storePage: T) {
    useEffect(() => {
        storePage.eventPageShown();

        return () => {
            storePage.eventPageExit();
        };
    }, []);
}
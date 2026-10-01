import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sitePages } from '../staticData/sitePages';

export function useAuthRedirect(isNeedAuth: boolean, isUserAuth: boolean) {
    const navigate = useNavigate();

    useEffect(() => {
        if (isNeedAuth && !isUserAuth) {
            navigate(sitePages.home, { replace: true });
            return;
        }

        if (!isNeedAuth && isUserAuth) {
            navigate(sitePages.contacts, { replace: true });
            return;
        }
    }, [isNeedAuth, isUserAuth, navigate]);
}
import { observer } from "mobx-react";
import { AuthContainer, AuthForm } from "../components/authorization";
import { usePageEnterExit } from "../hooks/usePageEnterExit";
import { type PageProps } from "../models/propsModels";
import { StorePageAuth } from "../store/pageAuthorization/storePageAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { storeAuthData } from "../store/global/storeAuthData";

function PageAuthorization(props: PageProps<StorePageAuth>) {
    usePageEnterExit(props.storePage);
    useAuthRedirect(false, storeAuthData.isAuth);

    if(!props.storePage.contentPage) {
        return null;
    }

    return (
        <AuthContainer>
            <AuthForm store={props.storePage.contentPage}/>
        </AuthContainer>
    );
}

export default observer(PageAuthorization);
import { useEffect } from "react";
import { observer } from "mobx-react";
import { type PageProps } from "../models/propsModels";
import { usePageEnterExit } from "../hooks/usePageEnterExit";
import { StorePageChat } from "../store/pageChat/storePageChat";
import { Chat } from "../components/chat";
import { LoaderPage } from "../components/loader";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { storeAuthData } from "../store/global/storeAuthData";
import { type WithStore } from "../models/withStore";
import { StorePageChatContent } from "../store/pageChat/storePageChatContent";

const SmartChat = observer((props: WithStore<StorePageChatContent>) => {
  useEffect(() => {
    props.store.serverRequestNotification();
  }, []);

    if (props.store.storeChatHistory.isLoading) {
    return (<LoaderPage />)
  }

  return( <Chat store={props.store.storeChatHistory}/>);
});


function PageChat(props: PageProps<StorePageChat>) {
  usePageEnterExit(props.storePage);
  useAuthRedirect(true, storeAuthData.isAuth);

  if (!props.storePage.contentPage.store) {
    return null;
  }

  const storeContent = props.storePage.contentPage.store;

  return (<SmartChat store={storeContent}/>);
}

export default observer(PageChat);
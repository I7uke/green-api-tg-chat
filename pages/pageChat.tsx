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
import { ChatByPhone } from "../components/chatByPhone";

const SmartChat = observer((props: WithStore<StorePageChatContent>) => {
  useEffect(() => {
    props.store.serverRequestChatHistory();
    props.store.serverRequestNotification();
  }, []);

  if (props.store.storeChatHistory.isLoadingMessages) {
    return (<LoaderPage />)
  }

  return (<Chat store={props.store.storeChatHistory} />);
});


function PageChat(props: PageProps<StorePageChat>) {
  usePageEnterExit(props.storePage);
  useAuthRedirect(true, storeAuthData.isAuth);

  if (!props.storePage.contentPage.store) {
    return null;
  }

  const storeContent = props.storePage.contentPage.store;

  if (storeContent.storeChatId.chatId) {
    return (<SmartChat store={storeContent} />);
  }

  return(<ChatByPhone store={storeContent.storeChatByPhone}/>)
}

export default observer(PageChat);
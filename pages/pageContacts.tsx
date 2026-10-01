import { observer } from "mobx-react";
import { type PageProps } from "../models/propsModels";
import { StorePageContacts } from "../store/pageContacts/storePageContacts";
import { usePageEnterExit } from "../hooks/usePageEnterExit";
import { type WithStore } from "../models/withStore";
import { StoreChats } from "../store/pageContacts/storeChats";
import { Contact } from "../components/contact";
import { LoaderPage } from "../components/loader";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { storeAuthData } from "../store/global/storeAuthData";

const SmartContactsList = observer((props: WithStore<StoreChats>) =>
  <>
    {props.store.chatsList.map(c => <Contact key={c.chatId} contact={c} />)}
  </>
);

function PageContacts(props: PageProps<StorePageContacts>) {
  usePageEnterExit(props.storePage);
  useAuthRedirect(true, storeAuthData.isAuth);

  if (!props.storePage.contentPage) {
    return null;
  }

  if (props.storePage.contentPage.storeChats.isLoading) {
    return <LoaderPage />
  }

  return (
    <div>
      <SmartContactsList store={props.storePage.contentPage.storeChats} />
    </div>
  );
}

export default observer(PageContacts);
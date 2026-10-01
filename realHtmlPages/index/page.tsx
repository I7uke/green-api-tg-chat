import DOMContentLoaded from "../../globalEvents/DOMContentLoaded";
import { StoreMain } from "../../store/storeMain";
import RealHtmlPageIndex from "./realHtmlPageIndex";

const storeMain = new StoreMain();

DOMContentLoaded({
    pageComponent: <RealHtmlPageIndex storeMain={storeMain} />,
});
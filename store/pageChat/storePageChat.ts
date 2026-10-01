import { AbstractStorePage, type AbstractStorePageInitData } from "../base/abstractStorePage";
import { StorePageChatContent } from "./storePageChatContent";
import { StoreContentPage } from "../storeContentPage";

export class StorePageChat extends AbstractStorePage {
    public readonly contentPage: StoreContentPage<StorePageChatContent>;

    protected override _pageShown(): void {
        const parser = new URLSearchParams(window.location.search);
        const chatIdParam = parser.get('chatId');
        const chatId = chatIdParam ? chatIdParam : null;
        this.contentPage.store = new StorePageChatContent(chatId);
        this.contentPage.store.serverRequestChatHistory();
    }

    protected override _pageExit(): void {
        this.contentPage.dispose();
    }


    constructor(initData: AbstractStorePageInitData) {
        super(initData);
        this.contentPage = new StoreContentPage();
    }
}
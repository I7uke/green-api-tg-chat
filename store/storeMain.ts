import { sitePages } from "../staticData/sitePages";
import { StorePage404 } from "./page404/storePage404";
import { StorePageAuth } from "./pageAuthorization/storePageAuth";
import { StorePageChat } from "./pageChat/storePageChat";
import { StorePageContacts } from "./pageContacts/storePageContacts";

export class StoreMain {
    public readonly page404: StorePage404;
    public readonly pageAuth: StorePageAuth;
    public readonly pageContacts: StorePageContacts;
    public readonly pageChat: StorePageChat;

    constructor() {
        this.page404 = new StorePage404({
            documentTitle: 'Страница не найдена 404',
            linkBack: sitePages.home,
        });

        this.pageAuth = new StorePageAuth({
            documentTitle: 'Авторизация',
        });

        this.pageContacts = new StorePageContacts({
            documentTitle: 'Чаты',
            pageTitle: 'Чаты'
        });

        this.pageChat = new StorePageChat({
            documentTitle: 'Беседа',
            pageTitle: 'Беседа',
            linkBack: sitePages.contacts
        });
    }
}

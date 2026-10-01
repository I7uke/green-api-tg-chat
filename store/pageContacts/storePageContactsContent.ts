import { apiGetChats } from "../../api/api";
import {type PageContent } from "../../models/pageContent";
import { storeAuthData } from "../global/storeAuthData";
import { StoreChats } from "./storeChats";

export class StorePageContactsContent implements PageContent {
    public readonly storeChats: StoreChats;

    public serverRequestGetChats() {
        const idInstance = storeAuthData.idInstance;
        const apiTokenInstance = storeAuthData.apiTokenInstance;
        this.storeChats.isLoading = true;
        apiGetChats(idInstance, apiTokenInstance)
            .then((response) => {
                // Специально берем только пользователей
                const chatsList = response.data.filter(c=> c.type === 'user');
                this.storeChats.chatsList = chatsList;
            })
            .finally(()=>{
                this.storeChats.isLoading = false;
            });
    }

    public dispose(): void {
        this.storeChats.chatsList = [];
    }

    constructor() {
        this.storeChats = new StoreChats();
    }
}
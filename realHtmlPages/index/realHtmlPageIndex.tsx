import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TemplateAuthPage, TemplatePage } from "../../components/template";
import React from "react";
import { StoreMain } from "../../store/storeMain";
import { sitePages } from "../../staticData/sitePages";

interface Props {
    readonly storeMain: StoreMain;
}

const Page404 = React.lazy(() => import('../../pages/page404'));
const PageAuthorization = React.lazy(() => import('../../pages/pageAuthorization'));
const PageContacts = React.lazy(() => import('../../pages/pageContacts'));
const PageChat = React.lazy(() => import('../../pages/pageChat'));

export default function RealHtmlPageIndex(props: Props) {
    const storeMain = props.storeMain;
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    element={<TemplatePage />}>
                    <Route
                        path={sitePages.home}
                        index
                        element={<PageAuthorization key={storeMain.pageAuth.pageKey} storePage={storeMain.pageAuth} />}
                    />
                    <Route element={<TemplateAuthPage />}>
                        <Route
                            path={sitePages.contacts}
                            index
                            element={<PageContacts key={storeMain.pageContacts.pageKey} storePage={storeMain.pageContacts}/>}
                        />
                        <Route
                            path={sitePages.chat}
                            index
                            element={<PageChat key={storeMain.pageChat.pageKey} storePage={storeMain.pageChat}/>}
                        />
                    </Route>
                </Route>
                <Route
                    path={'*'}
                    element={<Page404 key={storeMain.page404.pageKey} storePage={storeMain.page404} />}
                />
            </Routes>
        </BrowserRouter>
    );
}
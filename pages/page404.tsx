import Error404 from "../components/error404/error404";
import { usePageEnterExit } from "../hooks/usePageEnterExit";
import type { PageProps } from "../models/propsModels";
import { StorePage404 } from "../store/page404/storePage404";

export default function Page404(props: PageProps<StorePage404>) {
    usePageEnterExit(props.storePage);
    return (<Error404/>);
}
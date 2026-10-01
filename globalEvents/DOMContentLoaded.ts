import { ReactElement } from 'react';
import ReactDOMClient from 'react-dom/client';

interface DOMContentLoadedOptions {
    readonly pageComponent: ReactElement;
    readonly beforeRootRender?: () => void;
    readonly afterRootRender?: () => void;
}

async function event_DOMContentLoadedOptions(options: DOMContentLoadedOptions) {
    let rootContainer: HTMLElement | null = document.getElementById("Root");

    if (rootContainer) {
        rootContainer.innerHTML = '';
    } else {
        const container = document.createElement("div");
        document.body.append(container);
        rootContainer = container;
    }

    if (typeof options.beforeRootRender === 'function') {
        options.beforeRootRender();
    }

    const root = ReactDOMClient.createRoot(rootContainer);
    root.render(options.pageComponent);

    if (typeof options.afterRootRender === 'function') {
        options.afterRootRender();
    }
}

export default function DOMContentLoaded(inputOptions: DOMContentLoadedOptions) {
    const eventPageLoaded = event_DOMContentLoadedOptions.bind(null, inputOptions);
    document.addEventListener("DOMContentLoaded", eventPageLoaded);
}
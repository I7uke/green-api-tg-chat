import { AbstractStorePage } from "../store/base/abstractStorePage";

export interface PageProps<T extends AbstractStorePage> {
    readonly storePage: T
}

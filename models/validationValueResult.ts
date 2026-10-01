interface BaseValueResult<E, V> {
    readonly errorText: E;
    readonly validValue: V;
}

export type ValidationValueResult<T> = BaseValueResult<null, T> | BaseValueResult<string, null>;

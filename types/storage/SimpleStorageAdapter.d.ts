import { MarshalableType } from '../types';
import { SimpleStorage } from './storage.type';
export declare class SimpleStorageAdapter<T extends MarshalableType> implements SimpleStorage<T> {
    readonly key: string;
    private storage;
    constructor(key: string, storage: Storage);
    get(): T;
    set(value: T): void;
    remove(): void;
}

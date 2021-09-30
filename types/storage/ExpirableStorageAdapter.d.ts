import { MarshalableType } from '../types';
import { SimpleStorage, ExpirableStorageModel } from './storage.type';
export declare class ExpirableStorageAdapter<T extends MarshalableType> implements SimpleStorage<T> {
    private storage;
    expiredTime: number;
    constructor(storage: SimpleStorage<ExpirableStorageModel<T>>, expiredTime?: number);
    get key(): string;
    get(): T | null;
    set(value: T): void;
    remove(): void;
}

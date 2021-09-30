import { MarshalableType } from '../types';
import { SimpleStorage } from './storage.type';
export declare class MemorySimpleStorage<T extends MarshalableType> implements SimpleStorage<T> {
    readonly key: string;
    constructor(key: string);
    get(): T;
    set(value: T): void;
    remove(): void;
}

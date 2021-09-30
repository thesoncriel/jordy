import { CookieService, SimpleStorage } from './storage.type';
import { MarshalableType } from '../types';
export declare class CookieStorageAdapter<T extends MarshalableType> implements SimpleStorage<T> {
    private cookie;
    readonly key: string;
    expiredTime: number;
    constructor(cookie: CookieService, key: string, expiredTime?: number);
    get(): T | null;
    set(value: T): void;
    remove(): void;
}

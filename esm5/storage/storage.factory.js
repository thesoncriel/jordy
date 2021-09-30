import { CookieStorageAdapter } from './CookieStorageAdapter';
import { ExpirableStorageAdapter } from './ExpirableStorageAdapter';
import { MemorySimpleStorage } from './MemorySimpleStorage';
import { SimpleStorageAdapter } from './SimpleStorageAdapter';
import { cookie } from './cookie';
import { isServer, isStorageAvailable } from '../util/envCheck';
export var createStorage = function (type, key, expiredTime) {
    if (type === void 0) { type = 'session'; }
    if (key === void 0) { key = '_'; }
    if (expiredTime === void 0) { expiredTime = 0; }
    var ret;
    if (type !== 'cookie' && expiredTime > 0) {
        return new ExpirableStorageAdapter(createStorage(type, key), expiredTime);
    }
    if (isServer() || !isStorageAvailable() || type === 'memory') {
        ret = new MemorySimpleStorage(key);
    }
    else if (type === 'cookie') {
        ret = new CookieStorageAdapter(cookie, key, expiredTime);
    }
    else {
        try {
            ret = new SimpleStorageAdapter(key, type === 'local' ? localStorage : sessionStorage);
        }
        catch (error) {
            ret = new MemorySimpleStorage(key);
        }
    }
    return ret;
};

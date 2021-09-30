import { createStorage } from '../storage';
import { isServer } from '../util/envCheck';
var FORCE_NOT_CACHE = false;
function createKey(url, params) {
    if (params) {
        return url + "-" + JSON.stringify(params);
    }
    return url;
}
export function cache(type, expiredTime) {
    if (expiredTime === void 0) { expiredTime = 0; }
    if (isServer() || FORCE_NOT_CACHE) {
        return function (baseApi) {
            return baseApi.get;
        };
    }
    var cacheProxy = function (fn) {
        return function (url, params) {
            var storage = createStorage(type, createKey(url, params), expiredTime);
            var value = storage.get();
            if (value) {
                return Promise.resolve(value);
            }
            return fn(url, params).then(function (data) {
                storage.set(data);
                return data;
            });
        };
    };
    return function (baseApi) { return cacheProxy(baseApi.get); };
}

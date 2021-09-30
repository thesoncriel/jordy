"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
var storage_1 = require("../storage");
var envCheck_1 = require("../util/envCheck");
var FORCE_NOT_CACHE = false;
function createKey(url, params) {
    if (params) {
        return url + "-" + JSON.stringify(params);
    }
    return url;
}
function cache(type, expiredTime) {
    if (expiredTime === void 0) { expiredTime = 0; }
    if ((0, envCheck_1.isServer)() || FORCE_NOT_CACHE) {
        return function (baseApi) {
            return baseApi.get;
        };
    }
    var cacheProxy = function (fn) {
        return function (url, params) {
            var storage = (0, storage_1.createStorage)(type, createKey(url, params), expiredTime);
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
exports.cache = cache;

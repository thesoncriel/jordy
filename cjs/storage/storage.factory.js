"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStorage = void 0;
var CookieStorageAdapter_1 = require("./CookieStorageAdapter");
var ExpirableStorageAdapter_1 = require("./ExpirableStorageAdapter");
var MemorySimpleStorage_1 = require("./MemorySimpleStorage");
var SimpleStorageAdapter_1 = require("./SimpleStorageAdapter");
var cookie_1 = require("./cookie");
var envCheck_1 = require("../util/envCheck");
var createStorage = function (type, key, expiredTime) {
    if (type === void 0) { type = 'session'; }
    if (key === void 0) { key = '_'; }
    if (expiredTime === void 0) { expiredTime = 0; }
    var ret;
    if (type !== 'cookie' && expiredTime > 0) {
        return new ExpirableStorageAdapter_1.ExpirableStorageAdapter((0, exports.createStorage)(type, key), expiredTime);
    }
    if ((0, envCheck_1.isServer)() || !(0, envCheck_1.isStorageAvailable)() || type === 'memory') {
        ret = new MemorySimpleStorage_1.MemorySimpleStorage(key);
    }
    else if (type === 'cookie') {
        ret = new CookieStorageAdapter_1.CookieStorageAdapter(cookie_1.cookie, key, expiredTime);
    }
    else {
        try {
            ret = new SimpleStorageAdapter_1.SimpleStorageAdapter(key, type === 'local' ? localStorage : sessionStorage);
        }
        catch (error) {
            ret = new MemorySimpleStorage_1.MemorySimpleStorage(key);
        }
    }
    return ret;
};
exports.createStorage = createStorage;

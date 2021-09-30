"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieStorageAdapter = void 0;
var util_1 = require("../util");
var CookieStorageAdapter = (function () {
    function CookieStorageAdapter(cookie, key, expiredTime) {
        if (expiredTime === void 0) { expiredTime = 0; }
        this.cookie = cookie;
        this.key = key;
        this.expiredTime = expiredTime;
    }
    CookieStorageAdapter.prototype.get = function () {
        return (0, util_1.unmarshalJson)(this.cookie.get(this.key));
    };
    CookieStorageAdapter.prototype.set = function (value) {
        this.cookie.set(this.key, (0, util_1.marshalJson)(value), this.expiredTime);
    };
    CookieStorageAdapter.prototype.remove = function () {
        this.cookie.remove(this.key);
    };
    return CookieStorageAdapter;
}());
exports.CookieStorageAdapter = CookieStorageAdapter;

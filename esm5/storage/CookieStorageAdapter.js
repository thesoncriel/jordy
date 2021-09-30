import { marshalJson, unmarshalJson } from '../util';
var CookieStorageAdapter = (function () {
    function CookieStorageAdapter(cookie, key, expiredTime) {
        if (expiredTime === void 0) { expiredTime = 0; }
        this.cookie = cookie;
        this.key = key;
        this.expiredTime = expiredTime;
    }
    CookieStorageAdapter.prototype.get = function () {
        return unmarshalJson(this.cookie.get(this.key));
    };
    CookieStorageAdapter.prototype.set = function (value) {
        this.cookie.set(this.key, marshalJson(value), this.expiredTime);
    };
    CookieStorageAdapter.prototype.remove = function () {
        this.cookie.remove(this.key);
    };
    return CookieStorageAdapter;
}());
export { CookieStorageAdapter };

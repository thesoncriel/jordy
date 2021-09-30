import { createStorage } from './storage.factory';
var StorageTokenProvider = (function () {
    function StorageTokenProvider(storage) {
        this.storage = storage;
        this._token = '';
        this._token = this.storage.get() || '';
    }
    StorageTokenProvider.prototype.get = function () {
        return this.storage.get() || '';
    };
    StorageTokenProvider.prototype.set = function (token) {
        this._token = token;
        this.storage.set(token);
    };
    StorageTokenProvider.prototype.clear = function () {
        this._token = '';
        this.storage.remove();
    };
    return StorageTokenProvider;
}());
export function createTokenProvider(type, key) {
    return new StorageTokenProvider(createStorage(type, key));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenProvider = void 0;
var storage_factory_1 = require("./storage.factory");
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
function createTokenProvider(type, key) {
    return new StorageTokenProvider((0, storage_factory_1.createStorage)(type, key));
}
exports.createTokenProvider = createTokenProvider;

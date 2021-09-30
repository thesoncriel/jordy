"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStorageAdapter = void 0;
var util_1 = require("../util");
var SimpleStorageAdapter = (function () {
    function SimpleStorageAdapter(key, storage) {
        this.key = key;
        this.storage = storage;
    }
    SimpleStorageAdapter.prototype.get = function () {
        return (0, util_1.unmarshalJson)(this.storage.getItem(this.key));
    };
    SimpleStorageAdapter.prototype.set = function (value) {
        this.storage.setItem(this.key, (0, util_1.marshalJson)(value));
    };
    SimpleStorageAdapter.prototype.remove = function () {
        this.storage.removeItem(this.key);
    };
    return SimpleStorageAdapter;
}());
exports.SimpleStorageAdapter = SimpleStorageAdapter;

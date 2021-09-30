import { marshalJson, unmarshalJson } from '../util';
var SimpleStorageAdapter = (function () {
    function SimpleStorageAdapter(key, storage) {
        this.key = key;
        this.storage = storage;
    }
    SimpleStorageAdapter.prototype.get = function () {
        return unmarshalJson(this.storage.getItem(this.key));
    };
    SimpleStorageAdapter.prototype.set = function (value) {
        this.storage.setItem(this.key, marshalJson(value));
    };
    SimpleStorageAdapter.prototype.remove = function () {
        this.storage.removeItem(this.key);
    };
    return SimpleStorageAdapter;
}());
export { SimpleStorageAdapter };

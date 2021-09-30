var ExpirableStorageAdapter = (function () {
    function ExpirableStorageAdapter(storage, expiredTime) {
        if (expiredTime === void 0) { expiredTime = 0; }
        this.storage = storage;
        this.expiredTime = expiredTime;
    }
    Object.defineProperty(ExpirableStorageAdapter.prototype, "key", {
        get: function () {
            return this.storage.key;
        },
        enumerable: false,
        configurable: true
    });
    ExpirableStorageAdapter.prototype.get = function () {
        var mData = this.storage.get();
        if (!mData) {
            return null;
        }
        if (mData.expiredTime <= 0 || mData.expiredTime > Date.now()) {
            return mData.data;
        }
        this.storage.remove();
        return null;
    };
    ExpirableStorageAdapter.prototype.set = function (value) {
        this.storage.set({
            data: value,
            expiredTime: this.expiredTime > 0 ? Date.now() + this.expiredTime * 1000 : 0,
        });
    };
    ExpirableStorageAdapter.prototype.remove = function () {
        this.storage.remove();
    };
    return ExpirableStorageAdapter;
}());
export { ExpirableStorageAdapter };

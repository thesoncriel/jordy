"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorySimpleStorage = void 0;
var memoryCache = {};
var memoryCacheKeys = [];
var MEMORY_CACHE_MAX = 100;
var MemorySimpleStorage = (function () {
    function MemorySimpleStorage(key) {
        this.key = key;
    }
    MemorySimpleStorage.prototype.get = function () {
        return (memoryCache[this.key] || null);
    };
    MemorySimpleStorage.prototype.set = function (value) {
        var key = this.key;
        if (memoryCacheKeys.length >= MEMORY_CACHE_MAX) {
            var oldKey = memoryCacheKeys.shift();
            if (oldKey) {
                delete memoryCache[oldKey];
            }
        }
        if (!memoryCache.hasOwnProperty(key)) {
            memoryCacheKeys.push(key);
        }
        memoryCache[this.key] = value;
    };
    MemorySimpleStorage.prototype.remove = function () {
        var _this = this;
        delete memoryCache[this.key];
        memoryCacheKeys = memoryCacheKeys.filter(function (key) { return key !== _this.key; });
    };
    return MemorySimpleStorage;
}());
exports.MemorySimpleStorage = MemorySimpleStorage;

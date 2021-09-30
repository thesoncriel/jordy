"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.timeout = void 0;
function timeout(time, value, stopCallback) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(function () { return resolve(value); }, time);
        if (stopCallback) {
            stopCallback(function () {
                clearTimeout(t);
                reject(new Error('timeout stopped.'));
            });
        }
    });
}
exports.timeout = timeout;
function noop() { }
exports.noop = noop;

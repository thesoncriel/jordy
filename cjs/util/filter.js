"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = exports.throttle = void 0;
var tslib_1 = require("tslib");
var throttle_1 = (0, tslib_1.__importDefault)(require("lodash/throttle"));
var debounce_1 = (0, tslib_1.__importDefault)(require("lodash/debounce"));
function throttle(func, wait) {
    if (wait === void 0) { wait = 300; }
    return (0, throttle_1.default)(func, wait, { trailing: false });
}
exports.throttle = throttle;
function debounce(func, wait) {
    if (wait === void 0) { wait = 300; }
    return (0, debounce_1.default)(func, wait);
}
exports.debounce = debounce;

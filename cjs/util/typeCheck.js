"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.isFunction = exports.isEmptyObject = exports.isNumberLike = exports.isNumber = exports.isEmptyArray = exports.isNullable = exports.isString = exports.isUndefined = void 0;
function isUndefined(val) {
    return typeof val === 'undefined';
}
exports.isUndefined = isUndefined;
function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}
exports.isString = isString;
function isNullable(val) {
    return (isUndefined(val) || val === null || val === 'undefined' || val === 'null');
}
exports.isNullable = isNullable;
function isEmptyArray(val) {
    return !Array.isArray(val) || val.length === 0;
}
exports.isEmptyArray = isEmptyArray;
function isNumber(val) {
    return Object.prototype.toString.call(val) === '[object Number]';
}
exports.isNumber = isNumber;
function isNumberLike(val) {
    if (isNumber(val)) {
        return true;
    }
    if (isString(val)) {
        return /^[0-9]+$/.test(val);
    }
    return false;
}
exports.isNumberLike = isNumberLike;
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObject = isEmptyObject;
function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}
exports.isFunction = isFunction;
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
exports.isObject = isObject;

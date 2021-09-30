export function isUndefined(val) {
    return typeof val === 'undefined';
}
export function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}
export function isNullable(val) {
    return (isUndefined(val) || val === null || val === 'undefined' || val === 'null');
}
export function isEmptyArray(val) {
    return !Array.isArray(val) || val.length === 0;
}
export function isNumber(val) {
    return Object.prototype.toString.call(val) === '[object Number]';
}
export function isNumberLike(val) {
    if (isNumber(val)) {
        return true;
    }
    if (isString(val)) {
        return /^[0-9]+$/.test(val);
    }
    return false;
}
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
export function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}
export function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}

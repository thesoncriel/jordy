var bIsStorageAvailable = typeof localStorage !== 'undefined';
var bIsServer = typeof window === 'undefined';
export var isServer = function () { return bIsServer; };
export var setIsServer = function (val) {
    bIsServer = val;
};
export var isStorageAvailable = function () { return bIsStorageAvailable; };
export var setIsStorageAvailable = function (val) {
    bIsStorageAvailable = val;
};
var userAgent = isServer() ? '' : window.navigator.userAgent;
export function setUserAgent(ua) {
    if (isServer() && ua) {
        userAgent = ua;
    }
}
export function getUserAgent() {
    return userAgent;
}
export function isMobile() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPhone|iPod|Android/.test(ua);
}
export function isTablet() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPad/.test(ua);
}
export function isIOS() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPad|iPhone|iPad/.test(ua);
}
var nativeAppKeyword = '';
var bIsNativeApp = null;
export function setNativeAppKeyword(keyword) {
    nativeAppKeyword = keyword;
}
export function isNativeApp() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    if (bIsNativeApp === null) {
        bIsNativeApp = ua.indexOf(nativeAppKeyword) >= 0;
    }
    return bIsNativeApp;
}

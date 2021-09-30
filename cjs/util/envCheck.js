"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNativeApp = exports.setNativeAppKeyword = exports.isIOS = exports.isTablet = exports.isMobile = exports.getUserAgent = exports.setUserAgent = exports.setIsStorageAvailable = exports.isStorageAvailable = exports.setIsServer = exports.isServer = void 0;
var bIsStorageAvailable = typeof localStorage !== 'undefined';
var bIsServer = typeof window === 'undefined';
var isServer = function () { return bIsServer; };
exports.isServer = isServer;
var setIsServer = function (val) {
    bIsServer = val;
};
exports.setIsServer = setIsServer;
var isStorageAvailable = function () { return bIsStorageAvailable; };
exports.isStorageAvailable = isStorageAvailable;
var setIsStorageAvailable = function (val) {
    bIsStorageAvailable = val;
};
exports.setIsStorageAvailable = setIsStorageAvailable;
var userAgent = (0, exports.isServer)() ? '' : window.navigator.userAgent;
function setUserAgent(ua) {
    if ((0, exports.isServer)() && ua) {
        userAgent = ua;
    }
}
exports.setUserAgent = setUserAgent;
function getUserAgent() {
    return userAgent;
}
exports.getUserAgent = getUserAgent;
function isMobile() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPhone|iPod|Android/.test(ua);
}
exports.isMobile = isMobile;
function isTablet() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPad/.test(ua);
}
exports.isTablet = isTablet;
function isIOS() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    return /iPad|iPhone|iPad/.test(ua);
}
exports.isIOS = isIOS;
var nativeAppKeyword = '';
var bIsNativeApp = null;
function setNativeAppKeyword(keyword) {
    nativeAppKeyword = keyword;
}
exports.setNativeAppKeyword = setNativeAppKeyword;
function isNativeApp() {
    var ua = userAgent;
    if (!ua) {
        return false;
    }
    if (bIsNativeApp === null) {
        bIsNativeApp = ua.indexOf(nativeAppKeyword) >= 0;
    }
    return bIsNativeApp;
}
exports.isNativeApp = isNativeApp;

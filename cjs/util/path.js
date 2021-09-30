"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = exports.getFileName = void 0;
function getFileName(url) {
    try {
        return url.substring(url.lastIndexOf('/') + 1).split('?')[0];
    }
    catch (error) {
        return url;
    }
}
exports.getFileName = getFileName;
function parseQueryString(url) {
    var _a;
    var result = {};
    try {
        var queryString = url.split('?')[1];
        var splitedQueries = queryString.split('&');
        var len = splitedQueries.length;
        var key = '';
        var value = '';
        for (var i = 0; i < len; i++) {
            _a = splitedQueries[i].split('='), key = _a[0], value = _a[1];
            result[key] = decodeURIComponent(value);
        }
    }
    catch (error) {
    }
    return result;
}
exports.parseQueryString = parseQueryString;

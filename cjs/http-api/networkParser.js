"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToFormData = exports.axiosUploadCommon = exports.throwNewErrorForLib = exports.axiosCreateHeader = exports.axiosResponseToData = void 0;
var tslib_1 = require("tslib");
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var axiosResponseToData = function (axiosRes) {
    return axiosRes.data;
};
exports.axiosResponseToData = axiosResponseToData;
function axiosCreateHeader(headerProvider) {
    return {
        common: headerProvider(),
    };
}
exports.axiosCreateHeader = axiosCreateHeader;
var throwNewErrorForLib = function (parserVisitor) {
    return function (anyError) {
        var newError = parserVisitor.parse(anyError);
        return parserVisitor.interrupt(newError).then(function () {
            throw newError;
        });
    };
};
exports.throwNewErrorForLib = throwNewErrorForLib;
var axiosUploadCommon = function (baseUrl, parserVisitor, headerProvider, withCredentials) {
    if (withCredentials === void 0) { withCredentials = true; }
    return function (method, url, data, progCallback, timeout) {
        try {
            var headers = axiosCreateHeader(headerProvider);
            var fnCatchCommon = (0, exports.throwNewErrorForLib)(parserVisitor);
            return (0, axios_1.default)(baseUrl + url, {
                data: data,
                headers: headers,
                method: method,
                onUploadProgress: function (_a) {
                    var loaded = _a.loaded, total = _a.total;
                    var args = {
                        completed: loaded >= total,
                        loaded: loaded,
                        progress: Math.floor((loaded * 1000) / total) / 10,
                        total: total,
                    };
                    if (progCallback) {
                        progCallback(args);
                    }
                },
                withCredentials: withCredentials,
                timeout: timeout,
            })
                .then(exports.axiosResponseToData)
                .catch(fnCatchCommon);
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
};
exports.axiosUploadCommon = axiosUploadCommon;
function convertToFormData(data) {
    var formData = new FormData();
    var keys = Object.keys(data);
    var key = '';
    for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
            continue;
        }
        var value = data[key];
        if (Array.isArray(value)) {
            var len = value.length;
            for (var idx = 0; idx < len; idx++) {
                var file = value[idx];
                formData.append(key, file, file.name);
            }
        }
        else {
            formData.set(key, value);
        }
    }
    return formData;
}
exports.convertToFormData = convertToFormData;

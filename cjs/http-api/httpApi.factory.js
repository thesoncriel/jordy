"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpApi = void 0;
var tslib_1 = require("tslib");
var axios_1 = (0, tslib_1.__importDefault)(require("axios"));
var util_1 = require("../util");
var networkParser_1 = require("./networkParser");
var createHttpApi = function (baseUrl, parserVisitor, headerProvider, withCredentials) {
    if (headerProvider === void 0) { headerProvider = function () { return ({}); }; }
    if (withCredentials === void 0) { withCredentials = true; }
    var fnUploadCommon = (0, networkParser_1.axiosUploadCommon)(baseUrl, parserVisitor, headerProvider, withCredentials);
    var fnCatchCommon = (0, networkParser_1.throwNewErrorForLib)(parserVisitor);
    var fnExceptCommon = parserVisitor.throwOther;
    return {
        delete: function (url, params, timeout) {
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .delete("" + baseUrl + url, {
                    headers: headers,
                    params: params,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        get: function (url, params, timeout) {
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .get("" + baseUrl + url, {
                    headers: headers,
                    params: params,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        getFile: function (url, params, filename) {
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .get(baseUrl + url, {
                    headers: headers,
                    params: params,
                    responseType: 'blob',
                    withCredentials: withCredentials,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .then(function (blob) { return new File([blob], filename || (0, util_1.getFileName)(url)); })
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        getBlob: function (url, params) {
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .get(baseUrl + url, {
                    headers: headers,
                    params: params,
                    responseType: 'blob',
                    withCredentials: withCredentials,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        post: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .post(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        postUpload: function (url, data, progCallback, timeout) {
            return fnUploadCommon('post', url, (0, networkParser_1.convertToFormData)(data), progCallback, timeout);
        },
        put: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .put(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        putUpload: function (url, data, progCallback, timeout) {
            return fnUploadCommon('put', url, (0, networkParser_1.convertToFormData)(data), progCallback, timeout);
        },
        patch: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = (0, networkParser_1.axiosCreateHeader)(headerProvider);
                return axios_1.default
                    .patch(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(networkParser_1.axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
    };
};
exports.createHttpApi = createHttpApi;

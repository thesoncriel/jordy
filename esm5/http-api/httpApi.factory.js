import axios from 'axios';
import { getFileName } from '../util';
import { axiosCreateHeader, axiosResponseToData, axiosUploadCommon as uploadCommon, convertToFormData, throwNewErrorForLib, } from './networkParser';
export var createHttpApi = function (baseUrl, parserVisitor, headerProvider, withCredentials) {
    if (headerProvider === void 0) { headerProvider = function () { return ({}); }; }
    if (withCredentials === void 0) { withCredentials = true; }
    var fnUploadCommon = uploadCommon(baseUrl, parserVisitor, headerProvider, withCredentials);
    var fnCatchCommon = throwNewErrorForLib(parserVisitor);
    var fnExceptCommon = parserVisitor.throwOther;
    return {
        delete: function (url, params, timeout) {
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .delete("" + baseUrl + url, {
                    headers: headers,
                    params: params,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        get: function (url, params, timeout) {
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .get("" + baseUrl + url, {
                    headers: headers,
                    params: params,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        getFile: function (url, params, filename) {
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .get(baseUrl + url, {
                    headers: headers,
                    params: params,
                    responseType: 'blob',
                    withCredentials: withCredentials,
                })
                    .then(axiosResponseToData)
                    .then(function (blob) { return new File([blob], filename || getFileName(url)); })
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        getBlob: function (url, params) {
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .get(baseUrl + url, {
                    headers: headers,
                    params: params,
                    responseType: 'blob',
                    withCredentials: withCredentials,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        post: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .post(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        postUpload: function (url, data, progCallback, timeout) {
            return fnUploadCommon('post', url, convertToFormData(data), progCallback, timeout);
        },
        put: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .put(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
        putUpload: function (url, data, progCallback, timeout) {
            return fnUploadCommon('put', url, convertToFormData(data), progCallback, timeout);
        },
        patch: function (url, data, timeout) {
            if (data === void 0) { data = null; }
            try {
                var headers = axiosCreateHeader(headerProvider);
                return axios
                    .patch(baseUrl + url, data, {
                    headers: headers,
                    withCredentials: withCredentials,
                    timeout: timeout,
                })
                    .then(axiosResponseToData)
                    .catch(fnCatchCommon);
            }
            catch (error) {
                return Promise.reject(error).catch(fnExceptCommon);
            }
        },
    };
};

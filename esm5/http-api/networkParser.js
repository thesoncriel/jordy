import axios from 'axios';
export var axiosResponseToData = function (axiosRes) {
    return axiosRes.data;
};
export function axiosCreateHeader(headerProvider) {
    return {
        common: headerProvider(),
    };
}
export var throwNewErrorForLib = function (parserVisitor) {
    return function (anyError) {
        var newError = parserVisitor.parse(anyError);
        return parserVisitor.interrupt(newError).then(function () {
            throw newError;
        });
    };
};
export var axiosUploadCommon = function (baseUrl, parserVisitor, headerProvider, withCredentials) {
    if (withCredentials === void 0) { withCredentials = true; }
    return function (method, url, data, progCallback, timeout) {
        try {
            var headers = axiosCreateHeader(headerProvider);
            var fnCatchCommon = throwNewErrorForLib(parserVisitor);
            return axios(baseUrl + url, {
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
                .then(axiosResponseToData)
                .catch(fnCatchCommon);
        }
        catch (error) {
            return Promise.reject(error);
        }
    };
};
export function convertToFormData(data) {
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

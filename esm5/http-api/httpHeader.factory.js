import { isServer } from '../util/envCheck';
var acceptContentType = function (headerData) {
    headerData.Accept = 'application/json';
    return headerData;
};
var contentTypeFormPost = function (headerData) {
    headerData['Content-Type'] = 'application/x-www-form-urlencoded';
    return headerData;
};
var contentTypeFormMultipart = function (headerData) {
    headerData['Content-Type'] = 'multipart/form-data';
    return headerData;
};
var contentTypeJson = function (headerData) {
    headerData['Content-Type'] = 'application/json; charset=utf-8';
    return headerData;
};
var bearerToken = function (headerData, token) {
    if (token) {
        headerData.Authorization = "Bearer " + token;
    }
    return headerData;
};
export var headerPipe = {
    acceptContentType: acceptContentType,
    contentTypeFormPost: contentTypeFormPost,
    contentTypeFormMultipart: contentTypeFormMultipart,
    contentTypeJson: contentTypeJson,
    bearerToken: bearerToken,
};
export var createHttpHeaderProvider = function (tokenProvider) {
    return function () {
        var pipes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pipes[_i] = arguments[_i];
        }
        var token = '';
        if (tokenProvider) {
            token = tokenProvider.get();
            if (!token && !isServer()) {
                throw new Error('로그인 상태가 만료 되었습니다.\n다시 로그인 하여 주시기 바랍니다.');
            }
        }
        return pipes.reduce(function (prev, fn) { return fn(prev, token); }, {});
    };
};

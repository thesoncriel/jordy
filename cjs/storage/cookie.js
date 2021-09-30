"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookie = void 0;
exports.cookie = {
    set: function (key, value, expireDays) {
        if (expireDays === void 0) { expireDays = 1; }
        var d = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        var expires = 'expires=' + d.toUTCString();
        document.cookie = key + '=' + value + ';' + expires + ';path=/';
    },
    get: function (key) {
        var name = key + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    },
    remove: function (key) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    },
};

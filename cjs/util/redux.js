"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMessageBy = void 0;
var tslib_1 = require("tslib");
function clearMessageBy(errorMessages, name) {
    var result = (0, tslib_1.__assign)({}, errorMessages);
    delete result[name];
    return result;
}
exports.clearMessageBy = clearMessageBy;

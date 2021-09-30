"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberFormat = void 0;
var typeCheck_1 = require("./typeCheck");
function numberFormat(value, def) {
    if (def === void 0) { def = '0'; }
    if (!value || !(0, typeCheck_1.isNumber)(value)) {
        return def;
    }
    return value.toLocaleString();
}
exports.numberFormat = numberFormat;

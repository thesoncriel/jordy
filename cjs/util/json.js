"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshalJson = exports.marshalJson = void 0;
function marshalJson(value) {
    if (typeof value === 'string') {
        return value;
    }
    return JSON.stringify(value);
}
exports.marshalJson = marshalJson;
function unmarshalJson(raw) {
    if (raw) {
        if (/(^\{.*\}$|^\[.*\]$)/.test(raw)) {
            try {
                return JSON.parse(raw);
            }
            catch (error) {
                return null;
            }
        }
    }
    return raw;
}
exports.unmarshalJson = unmarshalJson;

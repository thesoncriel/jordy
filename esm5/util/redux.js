import { __assign } from "tslib";
export function clearMessageBy(errorMessages, name) {
    var result = __assign({}, errorMessages);
    delete result[name];
    return result;
}

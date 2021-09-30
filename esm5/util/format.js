import { isNumber } from './typeCheck';
export function numberFormat(value, def) {
    if (def === void 0) { def = '0'; }
    if (!value || !isNumber(value)) {
        return def;
    }
    return value.toLocaleString();
}

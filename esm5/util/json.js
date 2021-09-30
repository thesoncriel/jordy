export function marshalJson(value) {
    if (typeof value === 'string') {
        return value;
    }
    return JSON.stringify(value);
}
export function unmarshalJson(raw) {
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

import _throttle from 'lodash/throttle';
import _debounce from 'lodash/debounce';
export function throttle(func, wait) {
    if (wait === void 0) { wait = 300; }
    return _throttle(func, wait, { trailing: false });
}
export function debounce(func, wait) {
    if (wait === void 0) { wait = 300; }
    return _debounce(func, wait);
}

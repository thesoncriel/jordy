export function timeout(time, value, stopCallback) {
    return new Promise(function (resolve, reject) {
        var t = setTimeout(function () { return resolve(value); }, time);
        if (stopCallback) {
            stopCallback(function () {
                clearTimeout(t);
                reject(new Error('timeout stopped.'));
            });
        }
    });
}
export function noop() { }

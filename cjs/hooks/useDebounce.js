"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
var react_1 = require("react");
function useDebounce(fn, time) {
    if (time === void 0) { time = 500; }
    var timerRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () { return function () { return clearTimeout(timerRef.current); }; }, [fn]);
    return function (args) {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(function () {
            fn(args);
        }, time);
    };
}
exports.useDebounce = useDebounce;

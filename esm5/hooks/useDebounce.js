import { useEffect, useRef } from 'react';
export function useDebounce(fn, time) {
    if (time === void 0) { time = 500; }
    var timerRef = useRef(0);
    useEffect(function () { return function () { return clearTimeout(timerRef.current); }; }, [fn]);
    return function (args) {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(function () {
            fn(args);
        }, time);
    };
}

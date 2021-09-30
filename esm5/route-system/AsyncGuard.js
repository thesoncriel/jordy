import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { noop } from '../util';
export var AsyncGuard = function (_a) {
    var _b = _a.redirect, redirect = _b === void 0 ? '/' : _b, FailComp = _a.failComponent, guard = _a.guard, children = _a.children;
    var history = useHistory();
    var _c = useState(guard ? null : true), end = _c[0], setEnd = _c[1];
    useEffect(function () {
        if (end || !guard) {
            return noop;
        }
        var handleAsync = function (res) {
            if (res) {
                setEnd(true);
                return;
            }
            if (FailComp) {
                setEnd(false);
            }
            else {
                history.replace(redirect);
            }
        };
        Promise.resolve(0)
            .then(guard)
            .then(handleAsync)
            .catch(function () { return handleAsync(false); });
        return noop;
    }, [end, FailComp, history, redirect, guard]);
    if (end === false && FailComp) {
        return React.createElement(FailComp, null);
    }
    if (!end) {
        return null;
    }
    return React.createElement(React.Fragment, null, children);
};

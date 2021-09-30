"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncGuard = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importStar)(require("react"));
var react_router_1 = require("react-router");
var util_1 = require("../util");
var AsyncGuard = function (_a) {
    var _b = _a.redirect, redirect = _b === void 0 ? '/' : _b, FailComp = _a.failComponent, guard = _a.guard, children = _a.children;
    var history = (0, react_router_1.useHistory)();
    var _c = (0, react_1.useState)(guard ? null : true), end = _c[0], setEnd = _c[1];
    (0, react_1.useEffect)(function () {
        if (end || !guard) {
            return util_1.noop;
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
        return util_1.noop;
    }, [end, FailComp, history, redirect, guard]);
    if (end === false && FailComp) {
        return react_1.default.createElement(FailComp, null);
    }
    if (!end) {
        return null;
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
exports.AsyncGuard = AsyncGuard;

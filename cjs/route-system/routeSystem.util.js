"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuardSelector = exports.createGuardDispatch = void 0;
var tslib_1 = require("tslib");
function createGuardDispatch(store) {
    return function guardDispatch(effectResult) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var dispatch, action;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dispatch = store.dispatch;
                        return [4, dispatch(effectResult)];
                    case 1:
                        action = _a.sent();
                        return [2, action.meta.requestStatus === 'fulfilled'];
                }
            });
        });
    };
}
exports.createGuardDispatch = createGuardDispatch;
function createGuardSelector(store) {
    return function guardSelector(selector) {
        return selector(store.getState());
    };
}
exports.createGuardSelector = createGuardSelector;

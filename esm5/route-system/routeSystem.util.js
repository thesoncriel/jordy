import { __awaiter, __generator } from "tslib";
export function createGuardDispatch(store) {
    return function guardDispatch(effectResult) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatch, action;
            return __generator(this, function (_a) {
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
export function createGuardSelector(store) {
    return function guardSelector(selector) {
        return selector(store.getState());
    };
}

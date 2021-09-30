"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveRender = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var DeviceDetectContext_1 = require("./DeviceDetectContext");
var AdaptiveRender = function (_a) {
    var mobile = _a.mobile, notTablet = _a.notTablet, children = _a.children;
    var isMobile = (0, DeviceDetectContext_1.useIsMobile)();
    var isTablet = (0, DeviceDetectContext_1.useIsTablet)();
    if (notTablet && isTablet) {
        return null;
    }
    if ((mobile && isMobile) || (!mobile && !isMobile)) {
        return react_1.default.createElement(react_1.default.Fragment, null, children);
    }
    return null;
};
exports.AdaptiveRender = AdaptiveRender;

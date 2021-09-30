"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAdaptiveRender = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importDefault)(require("react"));
var DeviceDetectContext_1 = require("./DeviceDetectContext");
function withAdaptiveRender(settings) {
    var FnComp = function (props) {
        var isMobile = (0, DeviceDetectContext_1.useIsMobile)();
        var isTablet = (0, DeviceDetectContext_1.useIsTablet)();
        var isNative = (0, DeviceDetectContext_1.useIsNative)();
        var DesktopComp = settings.desktop, TabletComp = settings.tablet, MobileComp = settings.mobile, NativeAppComp = settings.native;
        var Comp;
        if (isNative && NativeAppComp) {
            Comp = NativeAppComp;
        }
        else if (isMobile && MobileComp) {
            Comp = MobileComp;
        }
        else if (isTablet && TabletComp) {
            Comp = TabletComp;
        }
        else if (!isMobile && !isTablet && DesktopComp) {
            Comp = DesktopComp;
        }
        else {
            return null;
        }
        return react_1.default.createElement(Comp, (0, tslib_1.__assign)({}, props));
    };
    return FnComp;
}
exports.withAdaptiveRender = withAdaptiveRender;

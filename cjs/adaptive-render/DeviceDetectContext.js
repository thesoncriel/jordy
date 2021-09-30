"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsNative = exports.useIsTablet = exports.useIsMobile = exports.DeviceDetectProvider = exports.DeviceDetectContext = void 0;
var tslib_1 = require("tslib");
var react_1 = (0, tslib_1.__importStar)(require("react"));
var envCheck_1 = require("../util/envCheck");
var device_type_1 = require("./device.type");
function getIsMobile() {
    if ((0, envCheck_1.isServer)()) {
        try {
            return (0, envCheck_1.isMobile)();
        }
        catch (error) {
        }
        return false;
    }
    return (0, envCheck_1.isMobile)() || window.innerWidth < device_type_1.DeviceSizeEnum.TABLET;
}
function getIsTablet() {
    if ((0, envCheck_1.isServer)()) {
        try {
            return (0, envCheck_1.isTablet)();
        }
        catch (error) {
        }
        return false;
    }
    return ((0, envCheck_1.isTablet)() ||
        (window.innerWidth >= device_type_1.DeviceSizeEnum.TABLET &&
            window.innerWidth <= device_type_1.DeviceSizeEnum.DESKTOP_SM - 1));
}
exports.DeviceDetectContext = (0, react_1.createContext)([
    getIsMobile(),
    getIsTablet(),
    (0, envCheck_1.isNativeApp)(),
]);
var DeviceDetectContextProvider = exports.DeviceDetectContext.Provider;
var DeviceDetectProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(getIsMobile()), isMobile = _b[0], setIsMobile = _b[1];
    var _c = (0, react_1.useState)(getIsTablet()), isTablet = _c[0], setIsTablet = _c[1];
    var isNative = (0, react_1.useMemo)(envCheck_1.isNativeApp, []);
    (0, react_1.useEffect)(function () {
        if ((0, envCheck_1.isServer)()) {
            return undefined;
        }
        var mqMobile = window.matchMedia("screen and (max-width: " + (device_type_1.DeviceSizeEnum.TABLET - 1) + "px)");
        var mqTablet = window.matchMedia("screen and (min-width: " + device_type_1.DeviceSizeEnum.TABLET + "px) and (max-width: " + (device_type_1.DeviceSizeEnum.DESKTOP_SM - 1) + "px)");
        var handleResizeForMobile = function (e) {
            setIsMobile(e.matches);
        };
        var handleResizeForTablet = function (e) {
            setIsTablet(e.matches);
        };
        if (mqMobile.addListener) {
            mqMobile.addListener(handleResizeForMobile);
            mqTablet.addListener(handleResizeForTablet);
        }
        else {
            mqMobile.addEventListener('change', handleResizeForMobile);
            mqTablet.addEventListener('change', handleResizeForTablet);
        }
        return function () {
            if (mqMobile.removeListener) {
                mqMobile.removeListener(handleResizeForMobile);
                mqTablet.removeListener(handleResizeForTablet);
            }
            else {
                mqMobile.removeEventListener('change', handleResizeForMobile);
                mqTablet.removeEventListener('change', handleResizeForTablet);
            }
        };
    }, []);
    return (react_1.default.createElement(DeviceDetectContextProvider, { value: [isMobile, isTablet, isNative] }, children));
};
exports.DeviceDetectProvider = DeviceDetectProvider;
var useIsMobile = function () { return (0, react_1.useContext)(exports.DeviceDetectContext)[0]; };
exports.useIsMobile = useIsMobile;
var useIsTablet = function () { return (0, react_1.useContext)(exports.DeviceDetectContext)[1]; };
exports.useIsTablet = useIsTablet;
var useIsNative = function () { return (0, react_1.useContext)(exports.DeviceDetectContext)[2]; };
exports.useIsNative = useIsNative;

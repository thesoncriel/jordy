import React, { createContext, useContext, useEffect, useMemo, useState, } from 'react';
import { isMobile as isMobileCheck, isNativeApp as isNativeAppCheck, isServer, isTablet as isTabletCheck, } from '../util/envCheck';
import { DeviceSizeEnum } from './device.type';
function getIsMobile() {
    if (isServer()) {
        try {
            return isMobileCheck();
        }
        catch (error) {
        }
        return false;
    }
    return isMobileCheck() || window.innerWidth < DeviceSizeEnum.TABLET;
}
function getIsTablet() {
    if (isServer()) {
        try {
            return isTabletCheck();
        }
        catch (error) {
        }
        return false;
    }
    return (isTabletCheck() ||
        (window.innerWidth >= DeviceSizeEnum.TABLET &&
            window.innerWidth <= DeviceSizeEnum.DESKTOP_SM - 1));
}
export var DeviceDetectContext = createContext([
    getIsMobile(),
    getIsTablet(),
    isNativeAppCheck(),
]);
var DeviceDetectContextProvider = DeviceDetectContext.Provider;
export var DeviceDetectProvider = function (_a) {
    var children = _a.children;
    var _b = useState(getIsMobile()), isMobile = _b[0], setIsMobile = _b[1];
    var _c = useState(getIsTablet()), isTablet = _c[0], setIsTablet = _c[1];
    var isNative = useMemo(isNativeAppCheck, []);
    useEffect(function () {
        if (isServer()) {
            return undefined;
        }
        var mqMobile = window.matchMedia("screen and (max-width: " + (DeviceSizeEnum.TABLET - 1) + "px)");
        var mqTablet = window.matchMedia("screen and (min-width: " + DeviceSizeEnum.TABLET + "px) and (max-width: " + (DeviceSizeEnum.DESKTOP_SM - 1) + "px)");
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
    return (React.createElement(DeviceDetectContextProvider, { value: [isMobile, isTablet, isNative] }, children));
};
export var useIsMobile = function () { return useContext(DeviceDetectContext)[0]; };
export var useIsTablet = function () { return useContext(DeviceDetectContext)[1]; };
export var useIsNative = function () { return useContext(DeviceDetectContext)[2]; };

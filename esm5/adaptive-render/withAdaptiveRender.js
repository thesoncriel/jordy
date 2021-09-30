import { __assign } from "tslib";
import React from 'react';
import { useIsMobile, useIsTablet, useIsNative } from './DeviceDetectContext';
export function withAdaptiveRender(settings) {
    var FnComp = function (props) {
        var isMobile = useIsMobile();
        var isTablet = useIsTablet();
        var isNative = useIsNative();
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
        return React.createElement(Comp, __assign({}, props));
    };
    return FnComp;
}

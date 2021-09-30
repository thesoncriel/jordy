import React from 'react';
import { useIsMobile, useIsTablet } from './DeviceDetectContext';
export var AdaptiveRender = function (_a) {
    var mobile = _a.mobile, notTablet = _a.notTablet, children = _a.children;
    var isMobile = useIsMobile();
    var isTablet = useIsTablet();
    if (notTablet && isTablet) {
        return null;
    }
    if ((mobile && isMobile) || (!mobile && !isMobile)) {
        return React.createElement(React.Fragment, null, children);
    }
    return null;
};

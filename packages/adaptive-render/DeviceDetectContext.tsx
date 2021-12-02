import { isFunction } from 'packages/util/typeCheck';
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isMobile as isMobileCheck,
  isNativeApp as isNativeAppCheck,
  isServer,
  isTablet as isTabletCheck,
} from '../util/envCheck';
import { DeviceSizeEnum } from './device.type';

function getIsMobile(): boolean {
  if (isServer()) {
    try {
      return isMobileCheck();
    } catch (error) {
      //
    }
    return false;
  }

  return isMobileCheck() || window.innerWidth < DeviceSizeEnum.TABLET;
}

function getIsTablet(): boolean {
  if (isServer()) {
    try {
      return isTabletCheck();
    } catch (error) {
      //
    }
    return false;
  }
  return (
    isTabletCheck() ||
    (window.innerWidth >= DeviceSizeEnum.TABLET &&
      window.innerWidth <= DeviceSizeEnum.DESKTOP_SM - 1)
  );
}

export const DeviceDetectContext = createContext([
  getIsMobile(),
  getIsTablet(),
  isNativeAppCheck(),
]);

const { Provider: DeviceDetectContextProvider } = DeviceDetectContext;

/**
 * 컨텍스트: UserAgent 및 Resizing 여부에 따른 태블릿/모바일 여부를 판별 해 준다.
 *
 * 지정된 곳 이외에서는 사용치 않는다.
 *
 * 내부적으로 window.mediaQuery API를 사용한다.
 *
 * @see https://stackoverflow.com/questions/29046324/whats-the-most-reliable-way-to-integrate-javascript-with-media-queries
 * @see https://jsperf.com/matchmedia-vs-resize/3
 */
export const DeviceDetectProvider: FC = ({ children }) => {
  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [isTablet, setIsTablet] = useState(getIsTablet());
  const isNative = useMemo(isNativeAppCheck, []);

  useEffect(() => {
    if (isServer() || !window || !isFunction(window.matchMedia)) {
      return undefined;
    }

    const mqMobile = window.matchMedia(
      `screen and (max-width: ${DeviceSizeEnum.TABLET - 1}px)`
    );
    const mqTablet = window.matchMedia(
      `screen and (min-width: ${DeviceSizeEnum.TABLET}px) and (max-width: ${
        DeviceSizeEnum.DESKTOP_SM - 1
      }px)`
    );

    const handleResizeForMobile = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    const handleResizeForTablet = (e: MediaQueryListEvent) => {
      setIsTablet(e.matches);
    };

    mqMobile.addEventListener('change', handleResizeForMobile);
    mqTablet.addEventListener('change', handleResizeForTablet);

    return () => {
      mqMobile.removeEventListener('change', handleResizeForMobile);
      mqTablet.removeEventListener('change', handleResizeForTablet);
    };
  }, []);

  return (
    <DeviceDetectContextProvider value={[isMobile, isTablet, isNative]}>
      {children}
    </DeviceDetectContextProvider>
  );
};

export const useIsMobile = () => useContext(DeviceDetectContext)[0];
export const useIsTablet = () => useContext(DeviceDetectContext)[1];
export const useIsNative = () => useContext(DeviceDetectContext)[2];

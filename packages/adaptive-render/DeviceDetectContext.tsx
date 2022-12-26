import { noop } from '../util/etc';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isMobile as isMobileCheck,
  isServer,
  isTablet as isTabletCheck,
} from '../util/envCheck';

function getIsMobile(breakpoint: number): boolean {
  if (isServer()) {
    try {
      return isMobileCheck();
    } catch (error) {
      //
    }
    return false;
  }

  return isMobileCheck() || window.innerWidth <= breakpoint;
}

function getIsTablet(breakpoints: number[]): boolean {
  if (isServer()) {
    try {
      return isTabletCheck();
    } catch (error) {
      //
    }
    return false;
  }
  if (isTabletCheck()) {
    return true;
  }
  if (breakpoints.length < 2) {
    return false;
  }
  return (
    isTabletCheck() ||
    (window.innerWidth > breakpoints[0] && window.innerWidth <= breakpoints[1])
  );
}

function defNativeAppChecker() {
  return false;
}

export const DeviceDetectContext = createContext([false, false, false]);

const { Provider: DeviceDetectContextProvider } = DeviceDetectContext;

const DEVICE_DETECT_DEFAULT_BREAKPOINTS = [539, 1080];

interface DeviceDetectProviderProps {
  /**
   * 디바이스 디텍터에서 모바일및 태블릿 여부를 확인하는 사이즈 기준.
   *
   * - 하나만 설정하면 mobile / desktop 으로 구분된다.
   * - 두개를 설정하면 mobile / tablet / desktop 3가지로 구분된다.
   *
   * @default [539, 1080]
   */
  breakpoints?: number[];
  /**
   * 네이티브 앱 여부를 확인하는 콜백.
   *
   * 결과가 true 면 네이티브앱, false 면 일반 웹이다.
   *
   * 콜백을 설정하지 않으면 항상 false 로 간주된다.
   * @returns
   */
  nativeAppChecker?: () => boolean;
  children?: React.ReactNode;
}

function subscribeForMobile(
  breakpoint: number,
  setIsMobile: (val: boolean) => void
) {
  const mqMobile = window.matchMedia(`screen and (max-width: ${breakpoint}px)`);
  const handleResizeForMobile = (e: MediaQueryListEvent) => {
    setIsMobile(e.matches);
  };
  mqMobile.addEventListener('change', handleResizeForMobile);

  return {
    unsubscribe() {
      mqMobile.removeEventListener('change', handleResizeForMobile);
    },
  };
}

function subscribeForTablet(
  breakpoints: number[],
  setIsTablet: (val: boolean) => void
) {
  if (breakpoints.length < 2) {
    return {
      unsubscribe: noop,
    };
  }
  const mqTablet = window.matchMedia(
    `screen and (min-width: ${breakpoints[0] + 1}px) and (max-width: ${
      breakpoints[1]
    }px)`
  );
  const handleResizeForTablet = (e: MediaQueryListEvent) => {
    setIsTablet(e.matches);
  };

  mqTablet.addEventListener('change', handleResizeForTablet);

  return {
    unsubscribe() {
      mqTablet.removeEventListener('change', handleResizeForTablet);
    },
  };
}

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
export const DeviceDetectProvider = ({
  breakpoints = DEVICE_DETECT_DEFAULT_BREAKPOINTS,
  nativeAppChecker = defNativeAppChecker,
  children,
}: DeviceDetectProviderProps) => {
  const [isMobile, setIsMobile] = useState(getIsMobile(breakpoints[0]));
  const [isTablet, setIsTablet] = useState(getIsTablet(breakpoints));
  const isNative = useMemo(nativeAppChecker, []);

  useEffect(() => {
    if (
      isServer() ||
      !window ||
      typeof window.matchMedia !== 'function' ||
      !breakpoints ||
      breakpoints.length === 0
    ) {
      return undefined;
    }

    const subMobile = subscribeForMobile(breakpoints[0], setIsMobile);
    const subTablet = subscribeForTablet(breakpoints, setIsTablet);

    return () => {
      subMobile.unsubscribe();
      subTablet.unsubscribe();
    };
  }, [breakpoints]);

  return (
    <DeviceDetectContextProvider value={[isMobile, isTablet, isNative]}>
      {children}
    </DeviceDetectContextProvider>
  );
};

export const useIsMobile = () => useContext(DeviceDetectContext)[0];
export const useIsTablet = () => useContext(DeviceDetectContext)[1];
export const useIsNative = () => useContext(DeviceDetectContext)[2];

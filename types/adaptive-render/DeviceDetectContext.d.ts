import React, { FC } from 'react';
export declare const DeviceDetectContext: React.Context<boolean[]>;
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
export declare const DeviceDetectProvider: FC;
export declare const useIsMobile: () => boolean;
export declare const useIsTablet: () => boolean;
export declare const useIsNative: () => boolean;

/**
 * 서버 환경인지 확인한다.
 */
export declare const isServer: () => boolean;
/**
 * isServer 의 확인 내용을 특정 값으로 설정 한다.
 *
 * 개발 모드에서만 가능하며 그 외 상황에서는 설정 내용을 무시한다.
 *
 * 그러므로 가급적 테스트 상황에서만 호출하여 사용한다.
 * @param val 서버 환경 여부에 대한 설정값
 */
export declare const setIsServer: (val: boolean) => void;
/**
 * 로컬 스토리지 사용 가능 여부를 확인한다.
 */
export declare const isStorageAvailable: () => boolean;
export declare const setIsStorageAvailable: (val: boolean) => void;
/**
 * user agent 정보를 설정 한다.
 * 설정하는 장소는 Next js SSR 기준으로 App.getInitialProps 이다.
 *
 * client side 에서 동작 시 무시한다.
 *
 * @param ua 적용 할 user agent 정보
 */
export declare function setUserAgent(ua?: string): void;
/**
 * user agent 정보를 가져 온다.
 *
 * server side 일 경우, 수행전 반드시 setUserAgent 로 값을 주어야 하며
 *
 * client side 는 자동으로 window.navigator.userAgent 값을 전달한다.
 */
export declare function getUserAgent(): string;
/**
 * user-agent 정보를 이용하여 단순 모바일인지 여부를 확인한다.
 *
 * 모바일 기종: 안드로이드 계열 전 기종, ios 를 사용하는 모든 기종 (아이폰, 아이패드, 아이팟 등)
 */
export declare function isMobile(): boolean;
/**
 * user-agent 정보를 이용하여 태블릿 여부를 판단한다.
 *
 * TODO: 아직 Android 태블릿 여부는 확인이 불가하다. (ipad 만 가능)
 */
export declare function isTablet(): boolean;
/**
 * user-agent 정보를 이용하여 ios 여부를 판단한다.
 */
export declare function isIOS(): boolean;
export declare function setNativeAppKeyword(keyword: string): void;
/**
 * user-agent 정보를 이용하여 native app 여부를 판단한다.
 */
export declare function isNativeApp(): boolean;

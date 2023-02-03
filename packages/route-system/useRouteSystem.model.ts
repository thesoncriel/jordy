/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ReactNode } from 'react';

export interface ModuleRouteChildModel {
  /**
   * routing 하기 위한 경로 설정
   */
  path?: string;
  /**
   * 설정된 경로에 렌더링 할 React Component
   *
   * @example
   * () => JSX.Element
   */
  element?: ComponentType<any>;
  /**
   * 설정된 경로의 하위 경로 설정
   *
   * `children`에서의 경로(`path`) 설정은 **상대적**이다.
   *
   * @example
   * {
   *  path: "/main",
   *  elemet: MainElement,
   *  children: [
   *    { path: "order", element: Element } // `/main/order`
   *  ]
   * }
   */
  children?: ModuleRouteChildModel[];
  /**
   * 자동 리다이렉트할 path 여부
   */
  redirect?: string;
  /**
   * Suspense fallback 여부.
   *
   * @default <></>
   */
  fallback?: React.ReactNode;
  /**
   * lazy 여부
   *
   * @default false
   */
  lazy?: boolean;
}

export interface ModuleRouteModel extends ModuleRouteChildModel {
  /**
   * 설정된 경로에 본인 포함, 모든 하위 경로에 Wrapper 설정
   *
   * **`children`을 `props`로 받아야만 한다.**
   *
   * @example
   *
   * ({children}) => <div>{children}</div>
   */
  wrap?: ComponentType<any>;
}

export interface ModuleRouteDefaultLazyOption {
  /**
   * 모든 route의 lazy 설정
   *
   * @default false
   */
  lazy?: boolean;
  /**
   * 모든 route의 fallback 설정
   *
   * @default <></>
   */
  fallback?: ReactNode;
}

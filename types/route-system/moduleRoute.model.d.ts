import { ComponentType } from 'react';
/**
 * 모듈에서 쓰이는 각종 페이지 컴포넌트의 라우팅 정보를 담은 객체
 */
export interface ModuleRouteModel {
    /**
     * 수행 경로
     */
    path: string;
    /**
     * 정확성 여부. 지정된 path 가 정확히 맞아야만 컴포넌트가 렌더링 된다.
     */
    exact?: boolean;
    /**
     * 현재 경로로 왔을 때 곧바로 이동될 다른 경로.
     *
     * 만약 guard 옵션에 설정이 되어있고 그 결과가 true 가 아니라면 설정된 주소를 사용하여 이동될 것이다.
     */
    redirect?: string;
    /**
     * 해당 페이지에 접근 시 별도 권한이 필요하다면 쓰이는 기능.
     *
     * 동기 혹은 비동기로 true 가 되면 페이지 렌더링이 된다.
     *
     * 만약 설정 되었음에도 true 가 안된다면,
     * 1. failComponent 에 설정된 컴포넌트를 렌더링 한다.
     * 2. failComponent 가 설정 안되어 있다면, redirect 에 설정된 주소로 이동된다.
     * 3. 아무것도 설정되어 있지 않다면 루트(/) 경로로 이동한다.
     *
     * 설정하지 않을 경우 무조건 렌더링 한다.
     */
    guard?: () => boolean | Promise<boolean>;
    /**
     * 설정된 페이지 컴포넌트를 감싸서 함께 렌더링될 상위 컴포넌트
     */
    wrap?: ComponentType<any>;
    /**
     * 렌더링에 사용될 페이지 컴포넌트.
     */
    component?: ComponentType<any>;
    /**
     * guard 설정 결과가 false 일 때 렌더링 될 컴포넌트.
     */
    failComponent?: ComponentType<any>;
    /**
     * 하위 라우팅 설정
     */
    child?: ModuleRouteModel[];
}

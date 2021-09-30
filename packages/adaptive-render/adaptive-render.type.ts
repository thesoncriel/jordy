import { FC, ComponentType } from 'react';

/**
 * 적응형 함수 설정 시 필요한 모델.
 */
export interface AdaptiveSettingModel<T> {
  /**
   * 네이티브 모바일앱 에서만 수행될 기능.
   *
   * 다른 조건들 대비 우선순위가 가장 높다.
   *
   * 미설정 시 앱에서 수행되지 않는다.
   */
  native?: T;
  /**
   * 모바일 에서만 수행될 기능.
   *
   * 미설정 시 모바일에서 수행되지 않는다.
   */
  mobile?: T;
  /**
   * 태블릿에서만 수행될 기능.
   *
   * 미설정 시 태블릿에서 수행되지 않는다.
   */
  tablet?: T;
  /**
   * 데스크탑에서만 수행될 기능.
   *
   * 미설정  desktop 에서 수행되지 않는다.
   */
  desktop?: T;
}

/**
 * 적응형 렌더링에서 쓰이는 설정 모델.
 */
export interface AdaptiveRenderSettingModel<T>
  extends AdaptiveSettingModel<FC<T> | ComponentType<T>> {
  /**
   * 네이티브 모바일앱 에서만 보여질 컴포넌트.
   *
   * 다른 조건들 대비 우선순위가 가장 높다.
   *
   * 미설정 시 앱에서 보여지지 않는다.
   */
  native?: FC<T> | ComponentType<T>;
  /**
   * 모바일 에서만 보여질 컴포넌트.
   *
   * 미설정 시 모바일에서 보여지지 않는다.
   */
  mobile?: FC<T> | ComponentType<T>;
  /**
   * 태블릿에서만 보여질 컴포넌트.
   *
   * 미설정 시 태블릿에서 보여지지 않는다.
   */
  tablet?: FC<T> | ComponentType<T>;
  /**
   * 데스크탑에서만 보여질 컴포넌트.
   *
   * 미설정  desktop 에서 보여지지 않는다.
   */
  desktop?: FC<T> | ComponentType<T>;
}

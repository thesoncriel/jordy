import React, { ReactElement, ReactNode } from 'react';
import { useIsMobile, useIsTablet } from './DeviceDetectContext';

interface AdaptiveRenderProps {
  /**
   * 데스크탑에서만 보여질 컴포넌트
   */
  desktop?: ReactElement | ReactNode | boolean;
  /**
   * 모바일 에서만 보이는지의 여부. 기본 false
   */
  mobile?: boolean;
  /**
   * 태블릿일 때는 보이지 않음 여부. 기본 false
   */
  notTablet?: boolean;

  children?: ReactNode;
}

/**
 * 적응형으로 렌더링 할 때 쓰인다.
 *
 * 이 컴포넌트의 자식 요소는 기본적으로 모바일일 경우 렌더링 되지 않는다.
 *
 * 모바일일 경우에만 보이게 할 때는 mobile 프로퍼티를 적용 시키면 된다.
 * @param props
 */
export const AdaptiveRender = ({
  mobile,
  notTablet,
  children,
}: AdaptiveRenderProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (notTablet && isTablet) {
    return null;
  }

  if ((mobile && isMobile) || (!mobile && !isMobile)) {
    return <>{children}</>;
  }

  return null;
};

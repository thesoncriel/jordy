import React, { FC, ComponentType } from 'react';
import { useIsMobile, useIsTablet, useIsNative } from './DeviceDetectContext';
import { AdaptiveRenderSettingUiState } from './adaptive-render.type';

/**
 * @description
 * HOC: 적응형 컴포넌트를 만든다.
 *
 * desktop, tablet 및 mobile 에 맞는 컴포넌트를 인수로 넘겨주면 된다.
 *
 * 각각의 세가지 컴포넌트는 반드시 Props 를 공통으로 사용해야 한다.
 *
 * 그리고 사용 시 반드시 각 컴포넌트가 공통으로 사용하는 Props 타입을 제네릭 선언 해 주어야 한다.
 *
 * 한편, 각 대응되는 device 별 인수를 넣지 않을 경우 그 device 환경이 되면 컴포넌트 렌더링을 하지 않는다.
 *
 * @example
 * interface InputProps {
 *   name: string;
 *   value: string;
 * }
 *
 * // tablet 이 빠져 있으므로 tablet 환경에서는 렌더링 하지 않는다.
 * // 사용 시 반드시 각 컴포넌트가 공통으로 사용하는 Props 타입을 제네릭 선언 해 주어야 한다.
 * const AdaptiveInput = hocAdaptiveRender<InputProps>({
 *   desktop: InputDesktop,
 *   mobile: InputMobile,
 * });
 *
 * // 사용 예
 * export const Test: FC = () => (
 *  <AdaptiveInput name="title" value="nani?" />
 * );
 *
 * @param settings 적응형으로 설정할 컴포넌트들.
 */
export function withAdaptiveRender<T>(
  settings: AdaptiveRenderSettingUiState<T>
) {
  const FnComp: FC<T> = (props) => {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isNative = useIsNative();
    const {
      desktop: DesktopComp,
      tablet: TabletComp,
      mobile: MobileComp,
      native: NativeAppComp,
    } = settings;

    let Comp: FC<T> | ComponentType<T>;

    if (isNative && NativeAppComp) {
      Comp = NativeAppComp;
    } else if (isMobile && MobileComp) {
      Comp = MobileComp;
    } else if (isTablet && TabletComp) {
      Comp = TabletComp;
    } else if (!isMobile && !isTablet && DesktopComp) {
      Comp = DesktopComp;
    } else {
      return null;
    }

    return <Comp {...props} />;
  };

  return FnComp;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback } from 'react';

/**
 * 훅: 쓰로틀을 적용한다.
 *
 * 적용 시 별도로 함수가 반환되며, 이 함수는 처음 수행 후 지정된 시간이 지날 때 까지 재호출이 되어도 다시 수행되지 않는다.
 *
 * 이 후 지정된 시간이 지나면 비로소 인수로 주어진 내부 콜백 함수를 수행한다.
 *
 * @example
 * const Example: FC = () => {
 *   const handler = (e: MouseEvent) => console.log('클릭이요!');
 *   // 첫 클릭 이후로 버튼을 연타 하면 300 미리초가 지날 때만 한번씩 콘솔에 출력된다.
 *   const handleClick = useThrottle(handler, 300);
 *
 *   return (
 *     <button type="button" onClick={handleClick}>
 *       0.3초마다 콘솔 찍히는 버튼!!
 *     </button>
 *   );
 * };
 *
 * @param fn 쓰로틀을 적용시킬 함수.
 * @param time 시간 조건(ms). 기본 300.
 * @param deps 생성되는 함수가 변경되어야 할 조건들 (dependencies)
 */
export function useThrottle<T = any>(
  fn: (args: T) => void,
  time = 300,
  deps: any[] = []
) {
  const timerRef = useRef(0);
  const memoizeFn = useCallback(fn, deps);

  useEffect(() => () => clearTimeout(timerRef.current), [memoizeFn]);

  const callback = useCallback(
    (args: T) => {
      if (timerRef.current) {
        return;
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = 0;
      }, time) as unknown as number;

      memoizeFn(args);
    },
    [memoizeFn]
  );

  return callback;
}

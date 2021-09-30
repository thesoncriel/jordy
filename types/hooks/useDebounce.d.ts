/**
 * 훅: 디바운스를 적용 한다.
 * 적용 시 별도로 함수가 반환되며, 이 함수는 특정시간이 지날 때 까지 재 호출이 없다면 비로소 인수로 주어진 내부 함수를 수행 한다.
 *
 * 참고:
 * https://medium.com/@feanar/debounce%EB%9E%80-%EB%AD%98%EA%B9%8C%EC%9A%94-82204c8b953f
 *
 * @example
 * const Button: FC = () => {
 *   const handler = (e: KeyboardEvent) => console.log(e.target.value);
 *   // 300 미리초가 지날 때 까지 추가적인 입력이 없으면 콘솔에 출력한다.
 *   const handleChange = useDebounce(handler, 300);
 *
 *   return (
 *     <input onChange={handleChange} />
 *   );
 * }
 *
 * @param fn 디바운스를 적용 시킬 함수. 외부에서 인수 전달 할 시 시간 조건이 성립되면 전달된 인수가 그대로 이 함수에 전달 된다.
 * @param time 시간 조건. 단위는 밀리초(ms). 기본 500.
 */
export declare function useDebounce<T = any>(fn: (args: T) => void, time?: number): (args: T) => void;

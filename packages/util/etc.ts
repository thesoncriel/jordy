/**
 * 특정 시간이 지난 후 비동기로 특정 값을 전달 한다.
 * @param time 경과 할 시간 (ms)
 * @param value 시간이 지난 후 전달 할 값
 * @param stopCallback 타임아웃 되기 전, 중지 할 수 있는 함수를 넘겨주는 콜백. stop 수행 시 reject 된다.
 */
export function timeout<T = void>(
  time: number,
  value?: T,
  stopCallback?: (stop: () => void) => void
) {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => resolve(value as T), time);

    if (stopCallback) {
      stopCallback(() => {
        clearTimeout(t);
        reject(new Error('timeout stopped.'));
      });
    }
  });
}

/**
 * 아무것도 수행하지 않는 빈 함수이다.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

function findAndFocus(key: string) {
  try {
    const input = document.querySelector(
      `*[name="${key}"], *[data-name="${key}"]`
    ) as HTMLInputElement | HTMLButtonElement;

    input && input.focus();

    return Boolean(input);
  } catch (error) {
    return false;
  }
}

/**
 * 주어진 값을 바탕으로 `name` 혹은 `data-name` 속성값이 지정된 요소를 찾는다.
 *
 * 그리고 그 중 가장 첫번째 것에 포커스를 준다.
 * @param inputNames
 * @returns
 */
export function focusByNames(inputNames: string | string[]) {
  if (Array.isArray(inputNames)) {
    return inputNames.some((key) => {
      const input = document.querySelector(
        `*[name="${key}"], *[data-name="${key}"]`
      ) as HTMLInputElement | HTMLButtonElement;

      input && input.focus();

      return Boolean(input);
    });
  }

  return findAndFocus(inputNames);
}

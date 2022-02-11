/* eslint-disable @typescript-eslint/no-explicit-any */
import _throttle from 'lodash-es/throttle';
import _debounce from 'lodash-es/debounce';

export function throttle(func: (...args: any) => any, wait = 300) {
  return _throttle(func, wait, { trailing: false });
}

export function debounce(func: (...args: any) => any, wait = 300) {
  return _debounce(func, wait);
}

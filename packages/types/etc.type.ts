// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PromiseResolver<T, E = any> {
  key?: string | number;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: E) => void;
}

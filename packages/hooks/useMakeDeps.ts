/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { isObject } from '../util/typeCheck';

export function useMakeDeps<T>(args?: T, keys?: string[] | (keyof T)[]) {
  const subKeys = useMemo(() => {
    if (keys) {
      return keys;
    }
    if (!args) {
      return [];
    }
    return Object.keys(args);
  }, [keys]);

  const deps: any[] = useMemo(() => {
    if (isObject(args)) {
      return (subKeys as string[]).map((subKey) => args[subKey as keyof T]);
    }
    if (Array.isArray(args)) {
      return args;
    }
    return [args];
  }, [args]);

  return deps;
}

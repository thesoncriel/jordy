import { AxiosError } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAxiosError(error: any): error is AxiosError {
  return (
    error &&
    error.response &&
    typeof error.response.status === 'number' &&
    error.config &&
    typeof error.config.url === 'string'
  );
}

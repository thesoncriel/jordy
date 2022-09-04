import { RestHttpMethodType } from './network.type';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpRestErrorType =
  | 'unknown'
  | 'auth'
  | 'forbidden'
  | 'notFound'
  | 'badRequest'
  | 'server';

export interface ErrorLike {
  message: string;
}

export interface HttpRestErrorMeta {
  url: string;
  method?: RestHttpMethodType;
  rawData?: any;
  errorType: HttpRestErrorType;
}

export interface HttpRestErrorMetaArgs {
  url: string;
  method?: RestHttpMethodType;
  rawData: any;
  status: number;
}

export interface HttpRestErrorLike extends ErrorLike, HttpRestErrorMeta {}

export class HttpRestError implements Error, HttpRestErrorLike {
  public static readonly DEFAULT_MESSAGE = '알 수 없는 서버 오류입니다.';

  public readonly name = 'HttpRestError';

  errorType: HttpRestErrorType = 'unknown';
  url = '';
  method: RestHttpMethodType | undefined = undefined;
  rawData: any = null;
  stack: string;

  constructor();
  constructor(message: string);
  constructor(message: string, errorType: HttpRestErrorType);
  constructor(message: string, statusCode: number);
  constructor(message: string, meta: HttpRestErrorMetaArgs);
  constructor(message: string, meta: HttpRestErrorLike);

  constructor(
    public readonly message = HttpRestError.DEFAULT_MESSAGE,
    arg1?:
      | HttpRestErrorMetaArgs
      | HttpRestErrorLike
      | HttpRestErrorType
      | number
  ) {
    this.stack = new Error(message).stack;
    this.init(arg1);
  }

  init(
    arg?: HttpRestErrorMetaArgs | HttpRestErrorLike | HttpRestErrorType | number
  ) {
    if (typeof arg === 'number') {
      this.errorType = this.toErrorType(arg);

      return;
    }
    if (HttpRestError.isHttpRestErrorType(arg)) {
      this.errorType = arg;

      return;
    }
    if (HttpRestError.isHttpRestErrorLike(arg)) {
      this.url = arg.url;
      this.method = arg.method;
      this.errorType = arg.errorType;
      this.rawData = arg.rawData;

      return;
    }
    if (typeof arg !== 'string' && arg) {
      this.url = arg.url || '';
      this.method = arg.method;
      this.errorType = this.toErrorType(Number(arg.status));
      this.rawData = arg.rawData;
    }
  }

  toPlainObject(): HttpRestErrorLike {
    return {
      message: this.message,
      method: this.method,
      errorType: this.errorType,
      url: this.url,
      rawData: this.rawData,
    };
  }

  toString() {
    return `[${this.name} ${this.errorType}: ${this.message}]`;
  }

  toErrorType(status: number): HttpRestErrorType {
    if (status === 401) {
      return 'auth';
    }
    if (status === 403) {
      return 'forbidden';
    }
    if (status === 404) {
      return 'notFound';
    }
    if (status >= 500) {
      return 'server';
    }
    if (status >= 400 && status < 500) {
      return 'badRequest';
    }
    return 'unknown';
  }

  static isHttpRestErrorType(value: unknown): value is HttpRestErrorType {
    const dic: Record<HttpRestErrorType, boolean> = {
      unknown: true,
      auth: true,
      forbidden: true,
      notFound: true,
      server: true,
      badRequest: true,
    };

    return Boolean(dic[value as never]);
  }

  static isErrorLike(error: unknown): error is ErrorLike {
    if (error instanceof Error) {
      return true;
    }
    if (
      error &&
      typeof error === 'object' &&
      typeof (error as ErrorLike).message === 'string'
    ) {
      return true;
    }
    return false;
  }

  static isHttpRestErrorLike(error: unknown): error is HttpRestErrorLike {
    if (error instanceof HttpRestError) {
      return true;
    }
    if (
      HttpRestError.isErrorLike(error) &&
      HttpRestError.isHttpRestErrorType(
        (error as HttpRestErrorLike).errorType
      ) &&
      typeof (error as HttpRestErrorLike).url === 'string'
    ) {
      return true;
    }
    return false;
  }

  static from(error: ErrorLike | string | HttpRestErrorLike): HttpRestError;
  static from(
    error: ErrorLike | string,
    errorType?: HttpRestErrorType
  ): HttpRestError;

  static from(
    error: HttpRestErrorLike | ErrorLike | string,
    errorType?: HttpRestErrorType
  ): HttpRestError {
    if (HttpRestError.isHttpRestErrorLike(error)) {
      return new HttpRestError(error.message, error);
    }
    if (HttpRestError.isErrorLike(error)) {
      return new HttpRestError(error.message, errorType);
    }
    if (typeof error === 'string') {
      return new HttpRestError(error, errorType);
    }
    return new HttpRestError();
  }
}

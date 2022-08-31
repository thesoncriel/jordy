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
  rawData?: any;
  errorType: HttpRestErrorType;
}

export interface HttpRestErrorMetaArgs {
  url: string;
  rawData: any;
  status: number;
}

export interface HttpRestErrorLike extends ErrorLike, HttpRestErrorMeta {}

export class HttpRestError extends Error implements HttpRestErrorLike {
  public static readonly DEFAULT_MESSAGE = '알 수 없는 서버 오류입니다';

  private _errorType: HttpRestErrorType = 'unknown';
  public get errorType() {
    return this._errorType;
  }

  private _url = '';
  public get url() {
    return this._url;
  }

  private _rawData: any = null;
  public get rawData() {
    return this._rawData;
  }

  constructor();
  constructor(message: string);
  constructor(message: string, errorType: HttpRestErrorType);
  constructor(message: string, statusCode: number);
  constructor(message: string, meta: HttpRestErrorMetaArgs);
  constructor(message: string, meta: HttpRestErrorLike);

  constructor(
    message = HttpRestError.DEFAULT_MESSAGE,
    arg1?:
      | HttpRestErrorMetaArgs
      | HttpRestErrorLike
      | HttpRestErrorType
      | number
  ) {
    super(message);

    if (typeof arg1 === 'number') {
      this._errorType = HttpRestError.toErrorType(arg1);

      return;
    }
    if (HttpRestError.isHttpRestErrorType(arg1)) {
      this._errorType = arg1;

      return;
    }
    if (HttpRestError.isHttpRestErrorLike(arg1)) {
      this._url = arg1.url;
      this._errorType = arg1.errorType;
      this._rawData = arg1.rawData;

      return;
    }
    if (typeof arg1 !== 'string' && arg1) {
      this._url = arg1.url || '';
      this._errorType = HttpRestError.toErrorType(arg1.status);
      this._rawData = arg1.rawData;
    }
  }

  toPlainObject(): HttpRestErrorLike {
    return {
      message: this.message,
      errorType: this._errorType,
      url: this._url,
      rawData: this._rawData,
    };
  }

  static toErrorType(status: number): HttpRestErrorType {
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

  static from(error: any, errorType?: HttpRestErrorType): HttpRestError {
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

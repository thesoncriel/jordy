/* eslint-disable @typescript-eslint/no-explicit-any */
import { RestHttpMethodType } from './network.type';

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
  status?: number;
  errorType?: HttpRestErrorType;
}

export interface HttpRestErrorLike extends ErrorLike, HttpRestErrorMeta {}

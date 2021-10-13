/* eslint-disable @typescript-eslint/no-explicit-any */
import { MarshallingType } from '../types';

/**
 * 업로드 상태를 확인할 수 있는 객체.
 */
export interface UploadStateArgs {
  /**
   * 진행도. 0~100 까지의 수치.
   */
  progress: number;
  /**
   * 업로드된 바이트수.
   */
  loaded: number;
  /**
   * 업로드 해야 할 총 바이트수.
   */
  total: number;
  /**
   * 완료여부.
   */
  completed: boolean;
}

/**
 * Axios 에서 업로드 상태 전달 콜백에 인자로 들어오는 이벤트 객체.
 */
export interface XhrUploadStateArgs {
  /**
   * 업로드 된 바이트 수
   */
  loaded: number;
  /**
   * 업로드 되어야 할 전체 바이트 수
   */
  total: number;
}

export interface HttpApiErrorParser<T, E extends Error = Error> {
  parse(libErrObj: T): E;
  throwOther<E extends Error>(err: E): never;
  interrupt: <E extends Error>(error: E) => Promise<void>;
}

/**
 * HTTP 프로토콜을 이용하여 비동기 통신을 수행한다.
 */
export interface HttpApi {
  /**
   * GET 메서드 호출
   * @param url 호출 경로
   * @param params 전달할 파라미터
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  get<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    params?: P,
    timeout?: number
  ): Promise<T>;
  /**
   * POST 메서드 호출
   * @param url 호출 경로. 만약 쿼리 파라미터가 포함된다면 이 곳에 추가적으로 명시 해 주어야 한다.
   * @param body 요청으로 보낼 데이터. json 으로 바꿔서 보내게 된다.
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  post<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T>;
  /**
   * PUT 메서드 호출
   * @param url 호출 경로. 만약 쿼리 파라미터가 포함된다면 이 곳에 추가적으로 명시 해 주어야 한다.
   * @param body 요청으로 보낼 데이터. json 으로 바꿔서 보내게 된다.
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  put<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T>;
  /**
   * PATCH 메서드 호출
   * @param url 호출 경로. 만약 쿼리 파라미터가 포함된다면 이 곳에 추가적으로 명시 해 주어야 한다.
   * @param body 요청으로 보낼 데이터. json 으로 바꿔서 보내게 된다.
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  patch<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T>;
  /**
   * DELETE 메서드 호출
   * @param url 호출 경로
   * @param params 전달할 파라미터
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  delete<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    params?: P,
    timeout?: number
  ): Promise<T>;
  /**
   * POST 메서드로 업로드 한다.
   * @param url 업로드 경로
   * @param data 업로드에 쓰이는 데이터
   * @param progCallback 업로드 상황을 보내주는 콜백
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  postUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T>;
  /**
   * PUT 메서드로 업로드 한다.
   * @param url 업로드 경로
   * @param data 업로드에 쓰이는 데이터
   * @param progCallback 업로드 상황을 보내주는 콜백
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  putUpload<
    T = void,
    P extends Record<string, any> = Record<string, string | File | File[]>
  >(
    url: string,
    data: P,
    progCallback?: (args: UploadStateArgs) => void,
    timeout?: number
  ): Promise<T>;
  /**
   * GET 메서드로 파일을 비동기로 가져온다.
   * @param url 파일을 가져올 경로
   * @param params 전달할 파라미터
   * @param filename 파일이 받아졌을 때 쓰여질 파일명.
   */
  getFile<P = Record<string, any> | void>(
    url: string,
    params?: P,
    filename?: string
  ): Promise<File>;
  /**
   * GET 메서드로 blob을 비동기로 가져온다.
   * @param url blob을 가져올 경로
   * @param params 전달할 파라미터
   */
  getBlob<P = Record<string, any> | void>(
    url: string,
    params?: P
  ): Promise<Blob>;
}

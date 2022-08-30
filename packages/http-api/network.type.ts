/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpRestErrorLike, MarshallingType } from '../types';

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

export interface HttpRestApi {
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
   * @param url 호출 경로. 만약 쿼리 파라미터가 포함된다면 이 곳에 추가적으로 명시 해 주어야 한다.
   * @param body 요청으로 보낼 데이터. json 으로 바꿔서 보내게 된다.
   * @param timeout 응답 제한시간 설정. 설정한 시간이 넘도록 응답이 없다면 중단하고 throw 를 일으킨다.
   */
  delete<T = MarshallingType, P = Record<string, any> | void>(
    url: string,
    body?: P,
    timeout?: number
  ): Promise<T>;
}

export interface HttpUploadApi {
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
}

export interface HttpFileApi {
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

/**
 * HTTP 프로토콜을 이용하여 비동기 통신을 수행한다.
 */
export interface HttpApi extends HttpRestApi, HttpFileApi {}

export type RestHttpMethodType = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HttpInterceptorConfig {
  /**
   * 요청 쿼리 파라미터에 특별한 값을 덧붙일 때 설정하는 인터셉터.
   *
   * @examples
   * ```ts
   * const storage = create<MyInfo>('session', 'myInfo');
   * const httpApi = createHttpApi('https://api.mysite.com', createHeader);
   *
   * // 매 요청 시 파라미터에 스토리지 내 값이 항상 포함된다.
   * httpApi.interceptor.params = () => {
   *   return {
   *     info: storage.get()
   *   };
   * };
   * ```
   */
  params?: <P = any>(
    method: RestHttpMethodType,
    url: string,
    params: P
  ) => Record<string, any> | void;
  /**
   * 에러 발생 시 추가로 내용을 확인하여 에러 파싱을 따로 할 때 설정하는 인터셉터.
   *
   * @examples
   * ```ts
   * const httpApi = createHttpApi('https://api.mysite.com', createHeader);
   *
   * // 통일되지 않은 특정 오류 발생 시 직접 확인하여 별도 파싱된다.
   * httpApi.interceptor.error = (prevError) => {
   *   if (prevError.message.includes('접근 금지')) {
   *     return new HttpRestError(prevError.message, 'forbidden');
   *   }
   *   if (prevError.url.includes('/styles') && prevError.rawData === '') {
   *     return new HttpRestError('스타일 조회가 잘못되었습니다.');
   *   }
   *   if (prevError.url.includes('/unexpects')) {
   *     // 직접 throw 를 발생시켜도 된다.
   *     throw new HttpRestError('예측되지 못한 요청');
   *   }
   * };
   * ```
   */
  error?: (error: HttpRestErrorLike) => HttpRestErrorLike | void;
}

export interface HttpInterceptorHandler {
  /**
   * 해당 네트워크에서 파라미터 혹은 에러 파싱 때 쓰일 인터셉터를 설정하거나 가져올 수 있다.
   *
   * @examples
   * ```ts
   * const httpApi = createHttpApi('https://api.mysite.com', createHeader);
   *
   * httpApi.interceptor = {
   *   // 쿼리 파라미터를 추가적으로 처리 할 인터셉터
   *   params: () => ({ some_id: localStorage.get('some_id') }),
   *   // 에러 파싱을 추가적으로 처리 할 인터셉터
   *   error: (error) => {
   *     if (error.url.includes('/login')) {
   *       return new HttpRestError('로그인이 필요합니다.', 'auth');
   *     }
   *   },
   * }
   * ```
   */
  interceptor: HttpInterceptorConfig;
}

export interface InterceptorHttpApi extends HttpApi, HttpInterceptorHandler {}

export interface InterceptorHttpUploadApi
  extends HttpUploadApi,
    HttpInterceptorHandler {}

export interface BaseAsyncHttpNetworkConfig {
  url: string;
  headers: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
}

export interface AsyncHttpNetworkConfig extends BaseAsyncHttpNetworkConfig {
  params?: any;
  paramsSerializer?: (params: any) => string;
}

export interface AsyncHttpNetworkProvider {
  get<T>(config: AsyncHttpNetworkConfig): Promise<T>;
  post<T>(config: AsyncHttpNetworkConfig): Promise<T>;
  put<T>(config: AsyncHttpNetworkConfig): Promise<T>;
  patch<T>(config: AsyncHttpNetworkConfig): Promise<T>;
  delete<T>(config: AsyncHttpNetworkConfig): Promise<T>;
  getBlob(config: AsyncHttpNetworkConfig): Promise<Blob>;
}

export interface AsyncHttpUploadConfig extends BaseAsyncHttpNetworkConfig {
  data: Record<string, string | File | File[]>;
  onProgress?: (args: UploadStateArgs) => void;
}

export interface AsyncHttpUploadProvider {
  post<T>(config: AsyncHttpUploadConfig): Promise<T>;
  put<T>(config: AsyncHttpUploadConfig): Promise<T>;
}

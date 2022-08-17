/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AsyncHttpNetworkProvider,
  AsyncHttpUploadProvider,
  HttpApi,
  HttpUploadApi,
} from './network.type';
import { throwHttpRestError } from './network.util';

type UnionHttpNetworkProviderType = HttpApi &
  HttpUploadApi &
  AsyncHttpNetworkProvider &
  AsyncHttpUploadProvider;

/**
 * ### class decorator
 *
 * 정해진 타입을 구현한 클래스를 대상으로 오류 내용을 일관성있게 파싱하는 기능을 추가한다.
 *
 * 해당 내용
 *
 * @param throwableParser 별도로 에러 파싱을 수행할 함수
 * @returns
 */
export function ErrorParser<E = any>(throwableParser: (error: E) => any) {
  function doParse(error: any): any {
    const nextError = throwableParser(error);

    if (nextError) {
      throw nextError;
    }

    throwHttpRestError(error);
  }

  return function <
    C extends {
      new (...args: any[]): any;
    }
  >(ClassConstructor: C): C {
    if (typeof ClassConstructor !== 'function') {
      throw new Error('ErrorParser: argument is not function.');
    }

    return class ErrorParserDecoratedUnionHttpNetworkProvider
      implements UnionHttpNetworkProviderType
    {
      private network = new ClassConstructor() as UnionHttpNetworkProviderType;

      get(...args: any[]) {
        return this.network.get.apply(this.network, [...args]).catch(doParse);
      }
      post(...args: any[]) {
        return this.network.post.apply(this.network, [...args]).catch(doParse);
      }
      put(...args: any[]) {
        return this.network.put.apply(this.network, [...args]).catch(doParse);
      }
      patch(...args: any[]) {
        return this.network.patch.apply(this.network, [...args]).catch(doParse);
      }
      delete(...args: any[]) {
        return this.network.delete
          .apply(this.network, [...args])
          .catch(doParse);
      }
      getFile(...args: any[]) {
        return this.network.getFile
          .apply(this.network, [...args])
          .catch(doParse);
      }
      getBlob(...args: any[]) {
        return this.network.getBlob
          .apply(this.network, [...args])
          .catch(doParse);
      }
      postUpload(...args: any[]) {
        return this.network.postUpload
          .apply(this.network, [...args])
          .catch(doParse);
      }
      putUpload(...args: any[]) {
        return this.network.putUpload
          .apply(this.network, [...args])
          .catch(doParse);
      }
    } as C;
  };
}

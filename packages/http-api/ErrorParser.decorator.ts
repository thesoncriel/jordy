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

type ConstructorType = {
  new (...args: any[]): any;
};

function isConstructor(val: unknown): val is ConstructorType {
  return typeof val === 'function';
}

/**
 * ### class decorator
 *
 * 정해진 타입을 구현한 클래스를 대상으로 오류 내용을 일관성있게 파싱하는 기능을 추가한다.
 *
 * 클래스 내 메서드 수행시 오류가 발생되지 않는다면 아무런 동작을 하지 않는다.
 *
 * @param throwableParser 별도로 에러 파싱을 수행할 함수
 * @see HttpRestError
 */
export function ErrorParser<E = any>(throwableParser: (error: E) => any) {
  return function <C extends ConstructorType>(ClassConstructor: C): C {
    if (isConstructor(ClassConstructor) === false) {
      throw new Error('ErrorParser: argument is not function.');
    }

    return class ErrorParserDecoratedUnionHttpNetworkProvider
      implements UnionHttpNetworkProviderType
    {
      private network: UnionHttpNetworkProviderType;

      constructor(...args: any[]) {
        this.network = new ClassConstructor(args[0], args[1], args[2]);
      }

      parse(error: any): any {
        const nextError = throwableParser(error);

        if (nextError) {
          throw nextError;
        }

        throwHttpRestError(error);
      }

      get(...args: any[]) {
        return this.network.get
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      post(...args: any[]) {
        return this.network.post
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      put(...args: any[]) {
        return this.network.put
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      patch(...args: any[]) {
        return this.network.patch
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      delete(...args: any[]) {
        return this.network.delete
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      getFile(...args: any[]) {
        return this.network.getFile
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      getBlob(...args: any[]) {
        return this.network.getBlob
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      postUpload(...args: any[]) {
        return this.network.postUpload
          .apply(this.network, [...args])
          .catch(this.parse);
      }
      putUpload(...args: any[]) {
        return this.network.putUpload
          .apply(this.network, [...args])
          .catch(this.parse);
      }
    } as C;
  };
}

/**
 * ### object decorator
 *
 * HttpApi 또는 HttpUploadApi 인터페이스를 구현한 객체를 대상으로 동작된다.
 *
 * 이들 메서드 수행중 발생된 오류 내용을 일관성있게 파싱하는 기능을 추가한다.
 *
 * 클래스 내 메서드 수행시 오류가 발생되지 않는다면 아무런 동작을 하지 않는다.
 * @param throwableParser
 * @returns
 */
export function decorateErrorParser<E = any>(
  throwableParser: (error: E) => any
) {
  return function decorator<
    T extends
      | HttpApi
      | HttpUploadApi
      | AsyncHttpNetworkProvider
      | AsyncHttpUploadProvider
  >(network: T) {
    const parse = (error: any): any => {
      const nextError = throwableParser(error);

      if (nextError) {
        throw nextError;
      }

      throwHttpRestError(error);
    };
    const self = network as UnionHttpNetworkProviderType;

    const result: UnionHttpNetworkProviderType = {
      get: (...args: []) => self.get.apply(self, [...args]).catch(parse),
      post: (...args: []) => self.post.apply(self, [...args]).catch(parse),
      put: (...args: []) => self.put.apply(self, [...args]).catch(parse),
      patch: (...args: []) => self.patch.apply(self, [...args]).catch(parse),
      delete: (...args: []) => self.delete.apply(self, [...args]).catch(parse),
      getFile: (...args: []) =>
        self.getFile.apply(self, [...args]).catch(parse),
      getBlob: (...args: []) =>
        self.getBlob.apply(self, [...args]).catch(parse),
      postUpload: (...args: []) =>
        self.postUpload.apply(self, [...args]).catch(parse),
      putUpload: (...args: []) =>
        self.putUpload.apply(self, [...args]).catch(parse),
    };

    return result as T;
  };
}

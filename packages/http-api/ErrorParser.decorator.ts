/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AsyncHttpNetworkProvider,
  AsyncHttpUploadProvider,
} from './network.type';
import { throwHttpRestError } from './network.util';

type UnionHttpNetworkProviderType = AsyncHttpNetworkProvider &
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
 * AsyncHttpNetworkProvider 혹은 AsyncHttpUploadProvider 를 구현하는 클래스에만 선언 가능하며 정상 동작이 보장된다.
 *
 * @param throwableParser 별도로 에러 파싱을 수행할 함수
 * @see HttpRestError
 * @see AsyncHttpNetworkProvider
 * @see AsyncHttpUploadProvider
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
      getBlob(...args: any[]) {
        return this.network.getBlob
          .apply(this.network, [...args])
          .catch(this.parse);
      }
    } as C;
  };
}

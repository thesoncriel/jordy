/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AsyncHttpNetworkProvider,
  AsyncHttpUploadProvider,
  RestHttpMethodType,
} from './network.type';
import { throwHttpRestError } from './network.util';

type UnionHttpNetworkProviderType = AsyncHttpNetworkProvider &
  AsyncHttpUploadProvider;

/** 데코레이터 내부에서 원본 메서드를 (path, params) 등 다양한 형태로 호출할 수 있도록 하는 타입 */
type NetworkMethod = (...args: any[]) => Promise<unknown>;

type ConstructorType = {
  new (...args: any[]): any;
};

function isConstructor(val: unknown): val is ConstructorType {
  return typeof val === 'function';
}

function getUrlFromFirstArg(first: unknown): string {
  if (typeof first === 'string') {
    return first;
  }
  if (first && typeof first === 'object' && 'url' in first) {
    return (first as { url: string }).url;
  }
  return '';
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
export function ErrorParser<E = any>(
  throwableParser: (error: E, method: RestHttpMethodType, url: string) => any
) {
  return function <C extends ConstructorType>(ClassConstructor: C): C {
    if (isConstructor(ClassConstructor) === false) {
      throw new Error('ErrorParser: argument is not function.');
    }

    return class ErrorParserDecoratedUnionHttpNetworkProvider {
      private network: UnionHttpNetworkProviderType;

      constructor(...args: any[]) {
        this.network = new ClassConstructor(
          args[0],
          args[1],
          args[2]
        ) as UnionHttpNetworkProviderType;
      }

      parse = async (error: any, method: RestHttpMethodType, url: string) => {
        const nextError = throwableParser(error, method, url);

        if (nextError) {
          throw nextError;
        }

        throwHttpRestError(error);
      };

      /* eslint-disable prefer-spread -- 존재하지 않는 메서드 호출 시 'of undefined' 오류 메시지를 위해 .apply 유지 */
      get(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.get as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'get', url));
      }
      post(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.post as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'post', url));
      }
      put(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.put as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'put', url));
      }
      patch(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.patch as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'patch', url));
      }
      delete(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.delete as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'delete', url));
      }
      getBlob(...args: any[]) {
        const url = getUrlFromFirstArg(args[0]);
        return (this.network.getBlob as NetworkMethod)
          .apply(this.network, args)
          .catch((err: any) => this.parse(err, 'get', url));
      }
      /* eslint-enable prefer-spread */
    } as C;
  };
}

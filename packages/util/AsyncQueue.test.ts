import { PromiseResolver } from '../types/etc.type';
import { createAsyncQueue } from './AsyncQueue';

describe('AsyncQueue', () => {
  function create() {
    return createAsyncQueue<string, Error>();
  }

  it('큐 생성 시 내부 요소는 비어있다.', () => {
    const result = create();

    expect(result.has()).toBe(false);
    expect(result.size()).toBe(0);
  });

  it('비어있을 때 clear 를 수행하면 아무일도 일어나지 않는다.', () => {
    const result = create();

    expect(() => result.clear()).not.toThrow();
  });

  describe('기능 테스트', () => {
    const q = create();

    afterEach(() => {
      q.clear();
    });

    it('삽입 했을 때 크기가 늘어난다.', () => {
      q.enqueue({
        resolve: vi.fn(),
        reject: vi.fn(),
      });

      expect(q.has()).not.toBe(false);
      expect(q.size()).toBe(1);

      q.enqueue({
        resolve: vi.fn(),
        reject: vi.fn(),
      });

      expect(q.size()).toBe(2);
    });

    it('삽입한 것을 꺼내면 크기가 줄어든다.', () => {
      q.enqueue({
        resolve: vi.fn(),
        reject: vi.fn(),
      });

      expect(q.has()).not.toBe(false);
      expect(q.size()).toBe(1);

      q.dequeue();

      expect(q.has()).toBe(false);
      expect(q.size()).toBe(0);
    });

    it('resolveAll 을 수행하면 내부 요소는 모두 resolve 를 수행하고 비워진다.', () => {
      const items = [0, 1, 2, 3, 4, 5];
      const mocks = items.map(() => {
        const mock = {
          resolve: vi.fn(),
          reject: vi.fn(),
        };

        q.enqueue(mock);

        return mock;
      });

      expect(q.size()).toBe(items.length);

      const workingSize = q.resolveAll('lookpin');

      mocks.forEach((mock) => {
        expect(mock.resolve).toBeCalledWith('lookpin');
        expect(mock.reject).not.toBeCalled();
      });

      expect(workingSize).toBe(items.length);
      expect(q.size()).toBe(0);
      expect(q.has()).toBe(false);
    });

    it('rejectAll 을 수행하면 내부 요소는 모두 reject 를 수행하고 비워진다.', () => {
      const items = [0, 1, 2, 3, 4, 5];
      const mocks = items.map(() => {
        const mock = {
          resolve: vi.fn(),
          reject: vi.fn(),
        };

        q.enqueue(mock);

        return mock;
      });

      expect(q.size()).toBe(items.length);

      const error = new Error('noop!');
      const workingSize = q.rejectAll(error);

      mocks.forEach((mock) => {
        expect(mock.resolve).not.toBeCalled();
        expect(mock.reject).toBeCalledWith(error);
      });

      expect(workingSize).toBe(items.length);
      expect(q.size()).toBe(0);
      expect(q.has()).toBe(false);
    });

    it('clear 를 수행하면 내부 요소는 모두 reject 를 수행하고 자동으로 모두 비워진다.', () => {
      const items = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const mocks = items.map(() => {
        const mock = {
          resolve: vi.fn(),
          reject: vi.fn(),
        };

        q.enqueue(mock);

        return mock;
      });

      expect(q.size()).toBe(items.length);

      q.clear();

      mocks.forEach((mock) => {
        expect(mock.resolve).not.toBeCalled();
        expect(mock.reject).toBeCalledWith(
          expect.objectContaining({
            message: expect.stringContaining('AsyncQueue'),
          })
        );
      });

      expect(q.size()).toBe(0);
      expect(q.has()).toBe(false);
    });

    describe('Promise 직접 활용', () => {
      it('resolveAll 을 수행하면 내부 요소는 모두 resolve 를 수행하고 비워진다.', async () => {
        const items = [0, 1, 2, 3, 4, 5];
        const promises = items.map(() => {
          return new Promise<string>((resolve, reject) => {
            q.enqueue({
              resolve,
              reject,
            });
          });
        });

        expect(q.size()).toBe(items.length);

        setTimeout(() => {
          const workingSize = q.resolveAll('lookpin');

          expect(workingSize).toBe(items.length);
        }, 5);

        const results = await Promise.all(promises);

        expect(results).toEqual(items.map(() => 'lookpin'));
        expect(q.size()).toBe(0);
      });

      it('rejectAll 을 수행하면 내부 요소는 모두 reject 를 수행하고 비워진다.', async () => {
        const items = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10];
        const promises = items.map(() => {
          return new Promise<string>((resolve, reject) => {
            q.enqueue({
              resolve,
              reject,
            });
          });
        });

        expect(q.size()).toBe(items.length);

        setTimeout(() => {
          const workingSize = q.rejectAll(
            new Error('hey! are you lookpin user?')
          );

          expect(workingSize).toBe(items.length);
        }, 5);

        const results = await Promise.allSettled(promises);

        expect(results).toHaveLength(items.length);
        expect(results).toEqual(
          items.map(() => {
            return expect.objectContaining({
              reason: expect.objectContaining({
                message: expect.stringContaining('lookpin'),
              }),
            });
          })
        );

        expect(q.size()).toBe(0);
      });

      it('clear 를 수행하면 내부 요소는 모두 reject 를 수행하고 비워진다.', async () => {
        const items = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10];
        const promises = items.map(() => {
          return new Promise<string>((resolve, reject) => {
            q.enqueue({
              resolve,
              reject,
            });
          });
        });

        expect(q.size()).toBe(items.length);

        setTimeout(() => {
          q.clear();
        }, 5);

        const results = await Promise.allSettled(promises);

        expect(results).toHaveLength(items.length);
        expect(results).toEqual(
          items.map(() => {
            return expect.objectContaining({
              reason: expect.objectContaining({
                message: expect.stringContaining('AsyncQueue'),
              }),
            });
          })
        );

        expect(q.size()).toBe(0);
      });
    }); // Promise 직접 활용 [end]

    describe('awaiting 수행', () => {
      it('곧바로 Promise 를 활용할 수 있다.', async () => {
        const items = [0, 1, 2, 3, 4, 5, 7];

        setTimeout(() => {
          q.resolveAll('oh~ jordy love~!');
        }, 5);

        const promises = items.map(() => q.awaiting());
        const results = await Promise.all(promises);

        expect(results).toHaveLength(items.length);
        expect(results).toEqual(
          items.map(() => {
            return expect.stringContaining('jordy');
          })
        );
      });
      it('Promise catch 에도 대응 가능하다.', async () => {
        const items = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10];

        setTimeout(() => {
          q.rejectAll(new Error('be happy ^^)/'));
        }, 5);

        const promises = items.map(() => q.awaiting());
        const results = await Promise.allSettled(promises);

        expect(results).toHaveLength(items.length);
        expect(results).toEqual(
          items.map(() => {
            return expect.objectContaining({
              reason: expect.objectContaining({
                message: expect.stringContaining('happy'),
              }),
            });
          })
        );
      });
    }); // awaiting 수행 [end]

    describe('First In First Out 테스트', () => {
      let resolveHistories: number[] = [];
      let rejectHistories: number[] = [];

      function createResolver(index: number): PromiseResolver<string> {
        return {
          resolve: vi.fn(() => {
            resolveHistories.push(index);

            return index;
          }),
          reject: vi.fn((err) => {
            rejectHistories.push(index);

            return err;
          }),
        };
      }

      afterEach(() => {
        resolveHistories = [];
        rejectHistories = [];
      });

      it('삽입하고 뺄 때 FIFO 규칙을 따른다.', () => {
        const samples = [1, 2, 3, 4, 5, 6];

        expect.assertions(samples.length);
        samples.forEach((_, index) => {
          q.enqueue(createResolver(index));
        });

        let index = 0;

        while (q.has()) {
          const resolver = q.dequeue();

          expect(resolver.resolve('theson')).toBe(index++);
        }
      });

      it('resolveAll 수행 시 삽입된 순서대로 resolve 시킨다.', () => {
        const samples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        expect.assertions(samples.length);
        samples.forEach((_, index) => {
          q.enqueue(createResolver(index));
        });

        q.resolveAll('lookpin!');

        resolveHistories.forEach((callHistory, pushedIndex) => {
          expect(callHistory).toBe(pushedIndex);
        });
      });

      it('rejectAll 수행 시 삽입된 순서대로 reject 시킨다.', () => {
        const samples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        expect.assertions(samples.length);
        samples.forEach((_, index) => {
          q.enqueue(createResolver(index));
        });

        q.rejectAll(new Error('lookpin!'));

        rejectHistories.forEach((callHistory, pushedIndex) => {
          expect(callHistory).toBe(pushedIndex);
        });
      });

      it('몇번의 awaiting 후 resolveAll 을 수행해도 정상적으로 순서를 지킨다.', async () => {
        const samples = [
          '룩핀',
          'FE',
          'BE',
          'IOS',
          'AOS',
          'Data',
          'AI',
          'fashion',
          'coordinate',
        ];
        const resultKeys = [] as string[];
        const promises = samples.map((key) => q.awaiting(key));

        const nextPromises = promises.map((prm, index) => {
          return prm.then(() => index);
        });

        setTimeout(() => {
          q.resolveAll('lookpin!', (key: string) => {
            resultKeys.push(key);
          });
          expect(resultKeys).toEqual(samples);
        }, 5);

        const results = await Promise.all(nextPromises);

        expect(results).toEqual(samples.map((_, index) => index));
      });

      it('몇번의 awaiting 후 rejectAll 을 수행해도 정상적으로 순서를 지킨다.', async () => {
        const samples = [
          '룩핀',
          'FE',
          'BE',
          'IOS',
          'AOS',
          'theson',
          'Data',
          'AI',
          'fashion',
          'coordinate',
        ];
        const resultKeys = [] as string[];
        const promises = samples.map((key) => q.awaiting(key));

        const nextPromises = promises.map((prm, index) => {
          return prm.catch((err) =>
            Promise.reject(new Error(`${err.message}: ${index}`))
          );
        });

        setTimeout(() => {
          q.rejectAll(new Error('lookpin!'), (key: string) => {
            resultKeys.push(key);
          });
          expect(resultKeys).toEqual(samples);
        }, 5);

        const results = await Promise.allSettled(nextPromises);

        expect(results).toEqual(
          samples.map((_, index) => {
            return expect.objectContaining({
              reason: expect.objectContaining({
                message: expect.stringContaining(index.toString()),
              }),
            });
          })
        );
      });
    }); // First In First Out 테스트 [end]
  });
});

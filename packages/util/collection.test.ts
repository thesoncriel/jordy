import { createMemoize } from './collection';

interface SampleDto {
  name: string;
  age: number;
}

describe('createMemoize', () => {
  it('값을 처음 설정하면 그 값을 그대로 반환한다.', () => {
    const memoize = createMemoize<SampleDto>();
    const initValue = { name: '룩핀', age: 10 };
    const result = memoize(initValue);

    expect(result).toBe(initValue);
  });

  it('다음 설정된 값이 이전값과 같다면 이전값을 반환한다.', () => {
    const memoize = createMemoize<SampleDto>();
    const initValue = { name: '룩핀', age: 10 };
    const nextValue = { name: '룩핀', age: 10 };

    memoize(initValue);

    const result = memoize(nextValue);

    expect(result).not.toBe(nextValue);
    expect(result).toBe(initValue);
  });

  it('clear 를 수행하면 내부 저장 값을 초기화 할 수 있다.', () => {
    const memoize = createMemoize<SampleDto>();
    const initValue = { name: '룩핀', age: 10 };
    const nextValue = { name: '룩핀', age: 10 };

    memoize(initValue);

    memoize.clear();

    const result = memoize(nextValue);

    expect(result).toBe(nextValue);
  });

  it('이전과 다른값이 들어오면 그 값을 반환한다.', () => {
    const memoize = createMemoize<SampleDto>();
    const initValue = { name: '룩핀', age: 10 };
    const nextValue = { name: '룩핀만세?!', age: 10 };

    memoize(initValue);

    const result = memoize(nextValue);

    expect(result).toBe(nextValue);
  });
});

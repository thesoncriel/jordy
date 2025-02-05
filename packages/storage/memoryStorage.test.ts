import { memoryStorage } from './memoryStorage';

describe('MemoryStorage', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토리지를 초기화합니다
    memoryStorage.clear();
  });

  test('setItem과 getItem이 정상적으로 동작해야 함', () => {
    memoryStorage.setItem('testKey', 'testValue');
    expect(memoryStorage.getItem('testKey')).toBe('testValue');
  });

  test('removeItem이 항목을 정상적으로 제거해야 함', () => {
    memoryStorage.setItem('testKey', 'testValue');
    memoryStorage.removeItem('testKey');
    expect(memoryStorage.getItem('testKey')).toBeUndefined();
  });

  test('length가 저장된 항목 수를 정확히 반환해야 함', () => {
    expect(memoryStorage.length).toBe(0);
    memoryStorage.setItem('key1', 'value1');
    memoryStorage.setItem('key2', 'value2');
    expect(memoryStorage.length).toBe(2);
  });

  test('clear가 모든 항목을 제거해야 함', () => {
    memoryStorage.setItem('key1', 'value1');
    memoryStorage.setItem('key2', 'value2');
    memoryStorage.clear();
    expect(memoryStorage.length).toBe(0);
    expect(memoryStorage.getItem('key1')).toBeUndefined();
  });

  test('key 메서드가 올바른 키를 반환해야 함', () => {
    memoryStorage.setItem('key1', 'value1');
    memoryStorage.setItem('key2', 'value2');
    expect(memoryStorage.key(0)).toBe('key1');
    expect(memoryStorage.key(1)).toBe('key2');
    expect(memoryStorage.key(2)).toBeNull();
  });

  test('최대 50개의 항목만 저장되어야 함', () => {
    // 51개의 항목을 저장
    for (let i = 0; i < 51; i++) {
      memoryStorage.setItem(`key${i}`, `value${i}`);
    }

    expect(memoryStorage.length).toBe(50);
    // 첫 번째로 저장된 항목은 제거되어야 함
    expect(memoryStorage.getItem('key0')).toBeUndefined();
    // 마지막으로 저장된 항목은 존재해야 함
    expect(memoryStorage.getItem('key50')).toBe('value50');
  });

  test('같은 키로 여러 번 저장할 경우 값이 업데이트되어야 함', () => {
    memoryStorage.setItem('testKey', 'value1');
    memoryStorage.setItem('testKey', 'value2');
    expect(memoryStorage.getItem('testKey')).toBe('value2');
    expect(memoryStorage.length).toBe(1);
  });
});

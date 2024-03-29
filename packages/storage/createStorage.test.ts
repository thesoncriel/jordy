/* eslint-disable no-undef */
vi.mock('./cookie', () => {
  const map: Record<
    string,
    {
      expires: number;
      value: string;
    }
  > = {};

  return {
    cookie: {
      set: vi.fn((key: string, value: string, expiredTime = 0) => {
        map[key] = {
          value,
          expires: Date.now() + expiredTime * 1000,
        };
      }),
      get: vi.fn((key: string) => {
        const item = map[key];

        if (item.expires <= Date.now()) {
          delete map[key];

          return null;
        }

        if (!item) {
          return null;
        }

        return item.value;
      }),
      remove: vi.fn((key: string) => {
        delete map[key];
      }),
    },
  };
});

import { timeout } from '../util/etc';
import { setIsServer, setIsStorageAvailable } from '../util/envCheck';
import { StorageType, SimpleStorage } from './storage.type';
import { createStorage } from './createStorage';
import { cookie } from './cookie';

interface TestUiState {
  name: string;
  age: number;
  isYouth: boolean;
}

interface TempWindow {
  localStorage?: Storage;
  sessionStorage?: Storage;
}
type Global = typeof global;

type TempGlobal = Global &
  TempWindow & {
    window?: TempWindow;
  };

function createMockStorage(): Storage {
  let data: { [key: string]: string } = {};

  return {
    clear() {
      data = {};
    },
    getItem(key: string) {
      return data[key] || null;
    },
    key(index: number) {
      try {
        return Object.keys(data)[index] || null;
      } catch (error) {
        return null;
      }
    },
    get length() {
      return Object.keys(data).length;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = value;
    },
  };
}

function createTestUiState() {
  return {
    age: 32,
    isYouth: true,
    name: 'sonic',
  };
}
function createTestArray() {
  return ['대한민국', '서울특별시', '강남구', '양재너구리'];
}
function createTestUiStateArray(): TestUiState[] {
  return [
    {
      age: 30,
      isYouth: false,
      name: '충무김밥',
    },
    {
      age: 50,
      isYouth: true,
      name: '꿀빵',
    },
    {
      age: 42,
      isYouth: false,
      name: '뺏때기죽',
    },
    {
      age: 19,
      isYouth: true,
      name: '우짜',
    },
  ];
}

describe('storage factory', () => {
  function doCheck(type: 'local' | 'session') {
    function getCurrentStorage() {
      if (type === 'local') {
        return localStorage;
      }
      return sessionStorage;
    }

    beforeAll(() => {
      Object.defineProperty(global, 'window', {
        configurable: true,
        value: {},
      });
    });

    describe('check: string', () => {
      const KEY = 'skbt';
      const VALUE = 'blah-blah';
      let sto: SimpleStorage<string>;

      beforeEach(() => {
        sto = createStorage<string>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        sto.set(VALUE);

        expect(sto.get()).toBe(VALUE);
        expect(getCurrentStorage().getItem(KEY)).toBe(VALUE);
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        sto.set(VALUE);

        expect(sto.get()).toBe(VALUE);

        sto.remove();

        expect(sto.get()).toBe(null);
        expect(getCurrentStorage().getItem(KEY)).toBe(null);
      });
    });

    describe('check: string array', () => {
      const KEY = 'skbt_arr';
      let sto: SimpleStorage<string[]>;

      beforeEach(() => {
        sto = createStorage<string[]>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
        expect(getCurrentStorage().getItem(KEY)).toBe(JSON.stringify(value));
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
        sto.remove();

        expect(sto.get()).toBe(null);
        expect(getCurrentStorage().getItem(KEY)).toBe(null);
      });
    });

    describe('check: object', () => {
      const KEY = 'obj_people';
      let sto: SimpleStorage<TestUiState>;

      beforeEach(() => {
        sto = createStorage<TestUiState>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestUiState();
        sto.set(value);

        const mValue = sto.get();

        expect(mValue).toEqual(value);
        expect(getCurrentStorage().getItem(KEY)).toBe(JSON.stringify(value));
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestUiState();
        sto.set(value);

        const mValue = sto.get();

        expect(mValue).toEqual(value);

        sto.remove();

        expect(sto.get()).toBe(null);
        expect(getCurrentStorage().getItem(KEY)).toBe(null);
      });
    });

    describe('check: object array', () => {
      const KEY = 'obj_people_arr';
      let sto: SimpleStorage<TestUiState[]>;

      beforeEach(() => {
        sto = createStorage<TestUiState[]>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestUiStateArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
        expect(getCurrentStorage().getItem(KEY)).toBe(JSON.stringify(value));
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestUiStateArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);

        sto.remove();

        expect(sto.get()).toBe(null);
        expect(getCurrentStorage().getItem(KEY)).toBe(null);
      });
    });

    afterAll(() => {
      const mGlobal: TempGlobal = global;

      delete mGlobal.window;
    });
  }

  beforeEach(() => {
    setIsServer(false);
    setIsStorageAvailable(true);
    Object.defineProperty(global, 'localStorage', {
      configurable: true,
      value: createMockStorage(),
    });
    Object.defineProperty(global, 'sessionStorage', {
      configurable: true,
      value: createMockStorage(),
    });
  });
  afterEach(() => {
    const mGlobal: TempGlobal = global;
    delete mGlobal.localStorage;
    delete mGlobal.sessionStorage;
    setIsServer(true);
    setIsStorageAvailable(false);
  });

  describe('create type: local', () => {
    doCheck('local');
  });
  describe('create type: session', () => {
    doCheck('session');
  });
});

describe('storage factory : memory mode', () => {
  function doCheck(isServer = false, type: StorageType = 'memory') {
    beforeAll(() => {
      if (isServer) {
        return;
      }
      Object.defineProperty(global, 'window', {
        configurable: true,
        value: {},
      });
    });

    describe('check: string', () => {
      const KEY = 'skbt';
      const VALUE = 'blah-blah';
      let sto: SimpleStorage<string>;

      beforeEach(() => {
        sto = createStorage<string>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        sto.set(VALUE);

        expect(sto.get()).toBe(VALUE);
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        sto.set(VALUE);

        expect(sto.get()).toBe(VALUE);

        sto.remove();

        expect(sto.get()).toBe(null);
      });
    });

    describe('check: string array', () => {
      const KEY = 'skbt_arr';
      let sto: SimpleStorage<string[]>;

      beforeEach(() => {
        sto = createStorage<string[]>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
        sto.remove();

        expect(sto.get()).toBe(null);
      });
    });

    describe('check: object', () => {
      const KEY = 'obj_people';
      let sto: SimpleStorage<TestUiState>;

      beforeEach(() => {
        sto = createStorage<TestUiState>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestUiState();
        sto.set(value);

        const mValue = sto.get();

        expect(mValue).toEqual(value);
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestUiState();
        sto.set(value);

        const mValue = sto.get();

        expect(mValue).toEqual(value);

        sto.remove();

        expect(sto.get()).toBe(null);
      });
    });

    describe('check: object array', () => {
      const KEY = 'obj_people_arr';
      let sto: SimpleStorage<TestUiState[]>;

      beforeEach(() => {
        sto = createStorage<TestUiState[]>(type, KEY);
      });

      it('just get: 설정하지 않았을 때 값을 가져오면 내용이 없어야 한다.', () => {
        expect(sto.get()).toBe(null);
      });
      it('set and get: 스토리지 서비스 및 로컬 스토리지의 설정된 값이 같아야 한다.', () => {
        const value = createTestUiStateArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);
      });
      it('remove: 삭제한 뒤 스토리지 내 값은 없어야 한다.', () => {
        const value = createTestUiStateArray();
        sto.set(value);

        const aValue = sto.get();

        expect(aValue).toEqual(value);

        sto.remove();

        expect(sto.get()).toBe(null);
      });
    });

    afterAll(() => {
      const mGlobal: Global & { window?: TempWindow } = global;

      delete mGlobal.window;
    });
  }

  describe('create type: memory', () => {
    doCheck(false);
  });
  describe('in server environment: 서버 환경에서는 무조건 메모리 모드로 동작 된다.', () => {
    doCheck(true, 'local');
  });
});

describe('expired time test', () => {
  const KEY = 'expired_test';

  function doCheck(type: StorageType) {
    it(`expired - mode=${type}: 자료를 설정하고 지정된 시간이 지나면 값이 존재하지 않아야 한다.`, async () => {
      const sto = createStorage<TestUiState>(type, KEY, 1);
      const origin: TestUiState = {
        age: 30,
        isYouth: false,
        name: 'thorn',
      };

      sto.set(origin);

      vi.useFakeTimers();

      await timeout(300, 0, () => {
        vi.runAllTimers();
      });

      vi.useFakeTimers();

      expect(sto.get()).toEqual(origin);

      await timeout(800, 0, () => {
        vi.runAllTimers();
      });

      expect(sto.get()).toBeNull();
    });
  }

  beforeAll(() => {
    setIsServer(false);
    setIsStorageAvailable(true);
  });

  afterAll(() => {
    setIsServer(true);
    setIsStorageAvailable(false);
  });

  describe.each(['session', 'local', 'memory'])('type: %s', doCheck);

  describe('type: cookie', () => {
    it('expired - mode=cookie: 자료를 설정하고 지정된 시간이 지나면 값이 존재하지 않아야 한다.', async () => {
      const sto = createStorage<TestUiState>('cookie', KEY, 1);
      const origin: TestUiState = {
        age: 30,
        isYouth: false,
        name: 'thorn',
      };

      sto.set(origin);

      expect(cookie.set).toBeCalledWith(KEY, JSON.stringify(origin), 1);

      vi.useFakeTimers();
      await timeout(300, 0, () => {
        vi.runAllTimers();
      });

      expect(sto.get()).toEqual(origin);

      vi.useFakeTimers();
      await timeout(800, 0, () => {
        vi.runAllTimers();
      });

      expect(sto.get()).toBeNull();
      expect(cookie.get).toBeCalledTimes(2);
    });
  });
});

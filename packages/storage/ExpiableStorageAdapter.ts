import { MarshallingType } from '../types';
import { SimpleStorage, ExpiableStorageModel } from './storage.type';

export class ExpiableStorageAdapter<T extends MarshallingType>
  implements SimpleStorage<T>
{
  constructor(
    private storage: SimpleStorage<ExpiableStorageModel<T>>,
    public expiredTime = 0
  ) {}

  get key() {
    return this.storage.key;
  }

  get(): T | null {
    const mData = this.storage.get();

    if (!mData) {
      return null;
    }

    if (mData.expiredTime <= 0 || mData.expiredTime > Date.now()) {
      return mData.data;
    }

    this.storage.remove();

    return null;
  }

  set(value: T): void {
    this.storage.set({
      data: value,
      expiredTime:
        this.expiredTime > 0 ? Date.now() + this.expiredTime * 1000 : 0,
    });
  }

  remove(): void {
    this.storage.remove();
  }
}

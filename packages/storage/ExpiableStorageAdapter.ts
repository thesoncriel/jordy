import { MarshallingType } from '../types';
import { SimpleStorage, ExpiableStorageUiState } from './storage.type';

export class ExpiableStorageAdapter<T extends MarshallingType>
  implements SimpleStorage<T>
{
  constructor(
    private storage: SimpleStorage<ExpiableStorageUiState<T>>,
    public expiredTime = 0
  ) {}

  private getExpiredTime() {
    return this.expiredTime > 0 ? Date.now() + this.expiredTime * 1000 : 0;
  }

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

  set(value: T, expiredDate?: string): void {
    let expiredTime = this.getExpiredTime();

    try {
      if (expiredDate && typeof expiredDate === 'string') {
        expiredTime = new Date(expiredDate).getTime();
      }
    } catch (error) {
      //
    }

    this.storage.set({
      data: value,
      expiredTime,
    });
  }

  remove(): void {
    this.storage.remove();
  }
}

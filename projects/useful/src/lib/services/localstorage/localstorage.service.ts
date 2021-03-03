import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {createInstance} from 'localforage';

import { LocalForage } from '../../vendors/localforage.vendor';

export interface LocalstorageConfigs {
  name?: string;
  storeName?: string;
  driver?: string | string[];
  size?: number;
  version?: number;
  description?: string;
}

export type LocalstorageIterateHandler<Data> = (
  value: Data,
  key: string,
  iterationNumber: number
) => Promise<unknown>;

export type LocalstorageIterateKeysHandler = (
  key: string,
  iterationNumber: number
) => Promise<unknown>;

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  private localforage?: LocalForage;

  constructor() { }

  init(storageConfigs: LocalstorageConfigs = {}) {
    this.localforage = createInstance({
      name: 'APP_LOCAL_STORAGE',
      ...storageConfigs
    });
    // done
    return this as LocalstorageService;
  }

  getLocalforage() {
    if (!this.localforage) {
      throw new Error('No localforage instance, please init first!');
    }
    return this.localforage;
  }

  extend(storageConfigs: LocalstorageConfigs) {
    return new LocalstorageService()
      .init(storageConfigs);
  }

  set<Data>(key: string, data: Data) {
    return from(this.getLocalforage().setItem(key, data));
  }

  increase(key: string, by = 1) {
    const handler = async (_key: string, _by: number) => {
      const value = await this.getLocalforage().getItem<number>(_key);
      const newValue = +(value || 0) + _by;
      await this.getLocalforage().setItem(_key, newValue);
      return newValue;
    };
    return from(handler(key, by));
  }

  get<Data>(key: string) {
    return from(this.getLocalforage().getItem<Data>(key));
  }

  getBulk(keys: string[]) {
    const handler = async (_keys: string[]) => {
      const result = [] as unknown[];
      for (let i = 0; i < _keys.length; i++) {
        const value = await this.getLocalforage().getItem(_keys[i]);
        result.push(value);
      }
      return result;
    };
    return from(handler(keys));
  }

  iterate<Data>(handler: LocalstorageIterateHandler<Data>) {
    return from(this.getLocalforage().iterate(handler));
  }

  iterateKeys(handler: LocalstorageIterateKeysHandler) {
    const asyncIterateKeys = async (_handler: LocalstorageIterateKeysHandler) => {
      const keys = await this.getLocalforage().keys();
      for (let i = 0; i < keys.length; i++) {
        await _handler(keys[i], i);
      }
    }
    return from(asyncIterateKeys(handler));
  }

  remove(key: string) {
    return from(this.getLocalforage().removeItem(key));
  }

  removeBulk(keys: string[]) {
    const asyncRemoveBulk = async (_keys: string[]) => {
      for (let i = 0; i < _keys.length; i++) {
        await this.getLocalforage().removeItem(_keys[i]);
      }
    };
    return from(asyncRemoveBulk(keys));
  }

  removeByPrefix(prefix: string) {
    const asyncRemoveByPrefix = async (_prefix: string) => {
      const _keys = await this.getLocalforage().keys();
      for (let i = 0; i < _keys.length; i++) {
        if (_keys[i].substr(0, _prefix.length) === _prefix) {
          await this.getLocalforage().removeItem(_keys[i]);
        }
      }
    }
    return from(asyncRemoveByPrefix(prefix));
  }

  removeBySuffix(suffix: string) {
    const asyncRemoveBySuffix = async (_suffix: string) => {
      const _keys = await this.getLocalforage().keys();
      for (let i = 0; i < _keys.length; i++) {
        if (_keys[i].substr(-_suffix.length) === _suffix) {
          await this.getLocalforage().removeItem(_keys[i]);
        }
      }
    }
    return from(asyncRemoveBySuffix(suffix));
  }

  clear() {
    return from(this.getLocalforage().clear());
  }

  keys() {
    return from(this.getLocalforage().keys());
  }
}

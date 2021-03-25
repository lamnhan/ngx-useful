import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import {
  LocalstorageService,
  LocalForageOptions,
  LocalstorageIterateHandler,
  LocalstorageIterateKeysHandler
} from '../localstorage/localstorage.service';

export interface CacheCaching {
  id?: string;
  for?: number;
}

export type CacheRefresher<Data> = Observable<undefined | null | Data>;

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private localstorage!: LocalstorageService;

  constructor() {}

  init(config: LocalForageOptions = {}) {
    this.localstorage = new LocalstorageService().init({
      name: 'APP_LOCAL_CACHE',
      ...config,
    });
    // done
    return this as CacheService;
  }

  set<Data>(key: string, data: Data, cacheTime: number) {
    return this.localstorage.setBulk({
      [key + '__expiration']: new Date().getTime() + Math.abs(cacheTime) * 60000,
      [key]: data,
    }).pipe(
      map(() => data),
    );
  }

  get<Data>(
    key: string,
    refresher?: CacheRefresher<Data>,
    cacheTime?: number,
  ) {
    return this.localstorage.getBulk<[null | number, null | Data]>([
      `${key}__expiration`,
      key
    ]).pipe(
      switchMap(values => {
        const [expiration, data] = values;
        const cacheDataAnyway = of(data);
        const refreshHandler = !refresher ? cacheDataAnyway : refresher.pipe(
          switchMap(freshData =>  freshData && cacheTime
            ? this.set(key, freshData, cacheTime)
            : cacheDataAnyway
          ),
        );
        // no cache value
        if (!data) {
          return !refresher
            ? cacheDataAnyway // no refresher
            : refreshHandler; // has refresher
        }
        // has cache value
        else {
          const isExpired = !expiration || expiration <= new Date().getTime();
          return (
            !isExpired // still valid
            || !refresher // invalid, no refresher
          )
            ? cacheDataAnyway
            : refreshHandler; // invalid, has refresher
        }
      })
    );
  }

  iterate<Data>(handler: LocalstorageIterateHandler<Data>) {
    return this.localstorage.iterate(handler);
  }

  iterateKeys(handler: LocalstorageIterateKeysHandler) {
    return this.localstorage.iterateKeys(handler);
  }

  remove(key: string) {
    return this.localstorage
      .remove(key + '__expiration')
      .pipe(
        switchMap(() => this.localstorage.remove(key))
      );
  }

  removeBulk(keys: string[]) {
    return this.localstorage.removeBulk(keys);
  }

  removeByPrefix(prefix: string) {
    return this.localstorage.removeByPrefix(prefix);
  }

  removeBySuffix(suffix: string) {
    return this.localstorage.removeBySuffix(suffix);
  }

  flush() {
    return this.localstorage.clear();
  }

  flushExpired() {
    return this.localstorage
      .iterateKeys(async key => {
      // loop through all expiration keys
      if (key.indexOf('__expiration') !== -1) {
        // retrieve expiration
        const cacheExpiration = await this.localstorage
          .getLocalforage()
          .getItem<number>(key);
        // remove if expired
        if (!cacheExpiration || cacheExpiration <= new Date().getTime()) {
          // expiration value
          await this.localstorage
            .getLocalforage()
            .removeItem(key);
          // data value
          await this.localstorage.
            getLocalforage()
            .removeItem(key.replace('__expiration', ''));
        }
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

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

export type CacheRefresher<Data> = Observable<Data>;

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

  set<Data>(key: string, data: Data, cacheTime = 0) {
    cacheTime = Math.abs(cacheTime);
    if (!key) {
      throw new Error('No cache key provided.');
    }
    if (cacheTime === 0) {
      throw new Error('No cache time provided.');
    }
    // save expiration
    return this.localstorage
      .set<number>(key + '__expiration', new Date().getTime() + cacheTime * 60000)
      .pipe(
        switchMap(() => this.localstorage.set<Data>(key, data))
      );
  }

  get<Data>(
    key: string,
    refresher?: CacheRefresher<Data>,
    cacheTime = 0,
  ) {
    return this.localstorage
    .get<number>(key + '__expiration')
    .pipe(
      switchMap(expiration => {
        const isExpired = !expiration || expiration <= new Date().getTime();
        // not expired
        if (!isExpired) {
          return this.localstorage.get<Data>(key);
        }
        // expired, try to refresh
        else if (refresher) {
          return refresher;
        }
        // no cached
        else {
          return of(null);
        }
      }),
      // result
      switchMap(data => !data
        // no data
        ? of(null)
        // has data
        : cacheTime === 0
          // return value if cache time = 0
          ? of(data)
          // save cache and return value
          : this.set(key, data, cacheTime)
      ),
      // no refresher or error while refreshing
      catchError(() => refresher
        // use cached any value
        ? this.localstorage.get<Data>(key)
        // null
        : of(null)
      ),
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

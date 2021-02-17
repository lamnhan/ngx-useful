import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';

import { HelperService } from '../helper/helper.service';
import {
  LocalstorageService,
  LocalstorageConfigs,
  LocalstorageIterateHandler,
  LocalstorageIterateKeysHandler
} from '../localstorage/localstorage.service';

export type CacheRefresher<Data> = () => Observable<Data>;

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private localstorage?: LocalstorageService;

  constructor(
    private helperService: HelperService,
    private localstorageService: LocalstorageService
  ) {}

  init(storageConfigs: LocalstorageConfigs = {}) {
    this.localstorage = this.localstorageService.extend({
      name: 'APP_LOCAL_CACHE',
      ...storageConfigs,
    });
    return this as CacheService;
  }

  getLocalstorage() {
    if (!this.localstorage) {
      throw new Error('No localstorage instance, please init first!');
    }
    return this.localstorage;
  }

  extend(storageConfigs: LocalstorageConfigs) {
    return new CacheService(this.helperService, this.localstorageService)
      .init(storageConfigs);
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
    return this.localstorageService
      .set<number>(key + '__expiration', new Date().getTime() + cacheTime * 60000)
      .pipe(
        mergeMap(() => this.localstorageService.set<Data>(key, data))
      );
  }

  get<Data>(
    key: string,
    refresher?: CacheRefresher<Data>,
    cacheTime = 0,
    keyBuilder?: (data: Data) => string
  ) {
    return this.localstorageService
    .get<number>(key + '__expiration')
    .pipe(
      mergeMap(expiration => {
        const isExpired = !expiration || expiration <= new Date().getTime();
        // not expired
        if (!isExpired) {
          return this.localstorageService.get<Data>(key);
        }
        // expired, try to refresh
        else if (refresher) {
          return refresher();
        }
        // no cached
        else {
          return this.helperService.observableResponder(null);
        }
      }),
      // result
      mergeMap(data => !data
        // no data
        ? this.helperService.observableResponder(null)
        // has data
        : cacheTime === 0
        // return value if cache time = 0
        ? this.helperService.observableResponder(data)
        // save cache and return value
        : this.set(
            keyBuilder ? keyBuilder(data as Data) : key,
            data,
            cacheTime
          )
      ),
      // no refresher or error while refreshing
      catchError(() => refresher
        // use cached any value
        ? this.localstorageService.get<Data>(key)
        // null
        : this.helperService.observableResponder(null)
      ),
    );
  }

  iterate<Data>(handler: LocalstorageIterateHandler<Data>) {
    return this.localstorageService.iterate(handler);
  }

  iterateKeys(handler: LocalstorageIterateKeysHandler) {
    return this.localstorageService.iterateKeys(handler);
  }

  remove(key: string) {
    return this.localstorageService
      .remove(key + '__expiration')
      .pipe(
        mergeMap(() => this.localstorageService.remove(key))
      );
  }

  removeBulk(keys: string[]) {
    return this.localstorageService.removeBulk(keys);
  }

  removeByPrefix(prefix: string) {
    return this.localstorageService.removeByPrefix(prefix);
  }

  removeBySuffix(suffix: string) {
    return this.localstorageService.removeBySuffix(suffix);
  }

  flush() {
    return this.localstorageService.clear();
  }

  flushExpired() {
    return this.localstorageService
      .iterateKeys(async key => {
      // loop through all expiration keys
      if (key.indexOf('__expiration') !== -1) {
        // retrieve expiration
        const cacheExpiration = await this.localstorageService
          .getLocalforage()
          .getItem<number>(key);
        // remove if expired
        if (!cacheExpiration || cacheExpiration <= new Date().getTime()) {
          // expiration value
          await this.localstorageService
            .getLocalforage()
            .removeItem(key);
          // data value
          await this.localstorageService.
            getLocalforage()
            .removeItem(key.replace('__expiration', ''));
        }
      }
    });
  }
}

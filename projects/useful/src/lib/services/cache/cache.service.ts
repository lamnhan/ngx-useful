import { Injectable } from '@angular/core';
import { of, Observable, ReplaySubject } from 'rxjs';
import { switchMap, map, tap, take } from 'rxjs/operators';

import {
  LocalstorageService,
  LocalForageOptions,
  LocalstorageIterateHandler,
  LocalstorageIterateKeysHandler
} from '../localstorage/localstorage.service';

export interface CacheConfig {
  name?: string;
  time?: number;
  group?: string;
}

export type CacheRefresher<Data> = Observable<undefined | null | Data>;

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private localstorage!: LocalstorageService;

  constructor() {}

  init(localForageOptions: LocalForageOptions = {}) {
    this.localstorage = new LocalstorageService().init({
      name: 'APP_LOCAL_CACHE',
      ...localForageOptions,
    });
    // done
    return this as CacheService;
  }

  caching<Data>(
    key: string,
    refresher: CacheRefresher<Data>,
    cacheTime: number
  ) {
    return new Caching<Data>(this, key, refresher, cacheTime);
  }

  set<Data>(key: string, data: Data, cacheTime: number) {
    return this.localstorage.setBulk({
      [key + '__expiration']: new Date().getTime() + Math.abs(cacheTime) * 60000,
      [key]: data,
    }).pipe(map(() => data));
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
          take(1),
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

  remove(key: string, keepData = false) {
    const keys = [key + '__expiration'];
    if (!keepData) {
      keys.push(key);
    }
    return this.localstorage.removeBulk(keys);
  }

  removeBulk(keys: string[]) {
    const bulkKeys = [] as string[];
    keys.forEach(key => bulkKeys.push(key + '__expiration', key));
    return this.localstorage.removeBulk(bulkKeys);
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

export class Caching<Data> {
  private data: null | Data = null;
  public readonly onData = new ReplaySubject<null | Data>(1);

  constructor(
    private readonly cacheService: CacheService,
    private readonly key: string,
    private readonly refresher: CacheRefresher<Data>,
    private readonly cacheTime: number,
  ) {
    this.get();
  }
  
  get() {
    return this.cacheService.get(this.key, this.refresher, this.cacheTime).pipe(
      tap(data => this.handleData(data))
    );
  }

  update(data: Data) {
    return of(data).pipe(
      tap(data => this.handleData(data)),
    );
  }

  refresh() {
    return this.cacheService.remove(this.key, true).pipe(
      switchMap(() => this.get()),
    );
  }

  remove() {
    return this.cacheService.remove(this.key).pipe(
      tap(() => this.handleData(null)),
      map(() => null),
    );
  }

  private handleData(data: null | Data) {
    this.data = data;
    this.onData.next(this.data);
  }
}

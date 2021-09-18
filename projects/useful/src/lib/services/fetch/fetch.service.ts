import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheConfig } from '../cache/cache.service';

export interface FetchOptions {
  cacheTime?: number;
}

export interface FetchIntegrations {
  cacheService?: CacheService;
}

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private options: FetchOptions = {};
  private integrations: FetchIntegrations = {};

  constructor(private helperService: HelperService) {}

  setOptions(options: FetchOptions) {
    this.options = options;
    return this as FetchService;
  }
  
  setIntegrations(integrations: FetchIntegrations) {
    this.integrations = integrations;
    return this as FetchService;
  }

  init() {
    return this as FetchService;
  }

  isGlobalCachingEnabled() {
    return !!this.options.cacheTime;
  }

  get<Data>(url: string, caching?: false | CacheConfig, requestInit?: RequestInit) {
    const getter = this.fetch(url, {...requestInit, method: 'GET'}, true) as Observable<Data>;
    // no caching
    if (caching === false) { return getter; }
    // with cache
    const { cacheGroup, cacheId, cacheTime } = this.getCacheMeta(url, caching);
    return (this.integrations.cacheService as CacheService).get<Data>(
      `fetch/${cacheGroup}/${cacheId}`,
      getter,
      cacheTime,
    ) as Observable<Data>;
  }

  cachingGet<Data>(url: string, caching?: CacheConfig, requestInit?: RequestInit) {
    const { cacheGroup, cacheId, cacheTime } = this.getCacheMeta(url, caching);
    return (this.integrations.cacheService as CacheService).caching<Data>(
      `fetch/${cacheGroup}/${cacheId}`,
      this.fetch(url, {...requestInit, method: 'GET'}, true),
      cacheTime,
    );
  }

  getText(url: string, caching?: false | CacheConfig, requestInit?: RequestInit) {
    const getter = this.fetch(url, {...requestInit, method: 'GET'}, false) as Observable<string>;
    // no caching
    if (caching === false) { return getter; }
    // with cache
    const { cacheGroup, cacheId, cacheTime } = this.getCacheMeta(url, caching);
    return (this.integrations.cacheService as CacheService).get<string>(
      `fetch/${cacheGroup}/${cacheId}`,
      getter,
      cacheTime,
    ) as Observable<string>;
  }

  cachingGetText(url: string, caching?: CacheConfig, requestInit?: RequestInit) {
    const { cacheGroup, cacheId, cacheTime } = this.getCacheMeta(url, caching);
    return (this.integrations.cacheService as CacheService).caching<string>(
      `fetch/${cacheGroup}/${cacheId}`,
      this.fetch(url, {...requestInit, method: 'GET'}, false),
      cacheTime,
    );
  }

  post<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch(url, {...requestInit, method: 'POST'}) as Observable<Data>;
  }

  put<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch(url, {...requestInit, method: 'PUT'}) as Observable<Data>;
  }

  patch<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch(url, {...requestInit, method: 'PATCH'}) as Observable<Data>;
  }

  delete<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch(url, {...requestInit, method: 'DELETE'}) as Observable<Data>;
  }
  
  private fetch(
    input: RequestInfo,
    requestInit?: RequestInit,
    isJson = true
  ) {
    const asyncFetch = async (
      _input: RequestInfo,
      _requestInit?: RequestInit,
      _isJson = true
    ) => {
      const response = await fetch(_input, _requestInit);
      if (!response.ok) {
        throw new Error('Fetch failed!');
      }
      return !_isJson ? response.text() : response.json();
    };
    return from(asyncFetch(input, requestInit, isJson));
  }

  private getCacheMeta(url: string, caching?: CacheConfig) {
    if (!this.integrations.cacheService) {
      throw new Error('No cache service integration.');
    }
    const cacheTime = caching?.time || this.options.cacheTime || 0;
    const cacheId = this.helperService.md5(caching?.name || url);
    const cacheGroup = caching?.group || 'app';
    return { cacheTime, cacheId, cacheGroup };
  }
}

import { Injectable } from '@angular/core';
import { from } from 'rxjs';

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

  init(
    options: FetchOptions = {},
    integrations: FetchIntegrations = {}
  ) {
    this.options = options;
    this.integrations = integrations;
    // init
    return this as FetchService;
  }

  get<Data>(
    url: string,
    requestInit?: RequestInit,
    isJson = true,
  ) {
    return this.fetch<Data>(url, {...requestInit, method: 'GET'}, isJson);
  }

  cachingGet<Data>(
    url: string,
    caching?: CacheConfig,
    requestInit?: RequestInit,
    isJson = true,
  ) {
    if (!this.integrations.cacheService) {
      throw new Error('No cache service integration.');
    }
    const cacheTime = caching?.time || this.options.cacheTime || 0;
    const cacheId = this.helperService.md5(caching?.name || url);
    const cacheGroup = caching?.group || 'app';
    return this.integrations.cacheService.caching(
      `fetch/${cacheGroup}/${cacheId}`,
      this.get<Data>(url, requestInit, isJson),
      cacheTime
    );
  }

  post<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch<Data>(url, {...requestInit, method: 'POST'});
  }

  put<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch<Data>(url, {...requestInit, method: 'PUT'});
  }

  patch<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch<Data>(url, {...requestInit, method: 'PATCH'});
  }

  delete<Data>(url: string, requestInit?: RequestInit) {
    return this.fetch<Data>(url, {...requestInit, method: 'DELETE'});
  }
  
  private fetch<Data>(
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
      return !_isJson ? response.text() : response.json() as Promise<Data>;
    };
    return from(asyncFetch(input, requestInit, isJson));
  }
}

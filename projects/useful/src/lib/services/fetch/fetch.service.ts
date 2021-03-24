import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { HelperService } from '../helper/helper.service';
import { CacheService, CacheCaching } from '../cache/cache.service';

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
    caching?: false | CacheCaching,
  ) {
    const fetcher = this.fetch<Data>(
      url,
      {...requestInit, method: 'GET'},
      isJson
    );
    if (!this.integrations.cacheService || caching === false) {
      return fetcher;
    }
    const cacheTime = caching?.for || this.options.cacheTime || 0;
    const cacheId = caching?.id
      ? 'id=' + caching.id
      : 'url=' + this.helperService.md5(url);
    return this.integrations.cacheService
      .get('fetch?' + cacheId, fetcher, cacheTime);
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

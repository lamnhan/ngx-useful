import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { HelperService } from '../helper/helper.service';
import { CacheService } from '../cache/cache.service';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  constructor(
    private helperService: HelperService,
    private cacheService: CacheService
  ) {}

  init() {
    return this as FetchService;
  }

  fetch<Data>(
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

  get<Data>(
    url: string,
    requestInit?: RequestInit,
    isJson = true,
    cacheTime = 0
  ) {
    return this.cacheService.get(
      'fetch_' + this.helperService.md5(url),
      () => this.fetch<Data>(
        url,
        {...requestInit, method: 'GET'},
        isJson
      ),
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
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { md5 } from '../../vendors/md5.vendor';
import {orderBy} from '../../vendors/orderby.vendor';

export interface PopupConfigs {
  url: string;
  name?: string;
  options?: string;
  callback?: () => unknown;
}

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor() {}

  md5(str: string, key?: string | undefined, raw?: boolean) {
    return md5(str, key, raw);
  }

  orderBy(
    collection: unknown[],
    iteratees: string[],
    orders: string[],
    guard?: unknown
  ) {
    return orderBy(collection, iteratees, orders, guard);
  }

  observableResponder<Value>(value: Value): Observable<Value> {
    return new Observable(observer => {
      observer.next(value);
      observer.complete();
    });
  }

  retryInterval(
    matched: () => boolean,
    interval = 1,
    timeout = 7,
  ) {
    return new Observable(observer => {
      const handler = (intervalId: number) => {
        if (matched()) {
          clearInterval(intervalId);
          // done
          observer.next(true);
          observer.complete();
        }
      };
      const actionInterval = setInterval(
        () => handler(actionInterval),
        interval * 1000,
      ) as unknown as number;
      handler(actionInterval); // immediately check
      // done anyway
      setTimeout(() => {
        clearInterval(actionInterval);
        observer.complete();
      }, timeout * 1000);
    });
  }

  o2a(
    object: {[$key: string]: any},
    clone = false,
    includeKey = true,
    limit?: number,
    nullResult = false
  ) {
    let result: null | unknown[] = [];
    // clone object
    if (clone) {
      object = Object.assign({}, object || {});
    }
    // turn {} => []
    for (const key of Object.keys(object)) {
      if (typeof object[key] === 'object') {
        object[key]['$key'] = key;
      } else {
        object[key] = {
          $key: key,
          value: object[key]
        };
      }
      if (!includeKey) {
        delete object[key]['$key'];
      }
      result.push(object[key]);
    }
    // limit
    if (limit) {
      result.splice(limit, result.length);
    }
    // null result
    if (nullResult && result.length < 1) {
      result = null;
    }
    // result
    return result;
  }

  cleanupStr(value: string) {
    return value
      .toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd');
  }

  filter<Item extends Record<string, unknown>>(
    items: Item[],
    keyword: string,
    fields?: string[]
  ) {
    const parse = (value: string) => {
      const cleanValue = this.cleanupStr(value);
      const dashes2Spaces = cleanValue.replace(/\-|\_/g, ' ');
      const noDashes = cleanValue.replace(/\-|\_/g, '');
      return cleanValue + ' | ' + dashes2Spaces + ' | ' + noDashes;
    };
    const finder = (item: Item, query: string) => {
      // title / $key
      let content = (item['title'] || item['$key']) as string;
      // custom fields
      (fields || []).forEach(field => {
        const value = item[field];
        if (!value) {
          return;
        } else if (value instanceof Object) {
          content = content + ' ' +
          JSON.stringify(value)
          .replace(/\{/g, '')
          .replace(/\"\}/g, '')
          .replace(/\{\"/g, '')
          .replace(/\"\:\"/g, ' ')
          .replace(/\"\,\"/g, ' ')
          .replace(/\"/g, '');
        } else {
          content = content + ' ' + value;
        }
      });
      // finalize values
      content = parse(content);
      query = this.cleanupStr(query);
      // check matching
      return (content.indexOf(query) !== -1);
    };
    return !keyword
      ? items
      : (items || []).filter(item => finder(item, keyword));
  }

  decodeJWTPayloadWithoutVerification(token: string) {
    const [, payloadStr] = token.split('.');
    return JSON.parse(atob(payloadStr));
  }

  isExpiredJWTWithoutVerification(token: string) {
    const {exp} = this.decodeJWTPayloadWithoutVerification(token);
    return this.isExpiredInSeconds(exp || 0, 60); // exp or always, and 1 minute earlier
  }

  isExpiredInSeconds(expiredTime: number, costMore = 0) {
    const time = Math.ceil(new Date().getTime() / 1000) + costMore;
    return time >= expiredTime;
  }

  createPopup(config: PopupConfigs) {
    const url = config.url || '/';
    const name = config.name || 'AppOAuthLogin'; // no space for IE
    const options =
      config.options ||
      'location=0,status=0' +
        ',width=' +
        window.innerWidth +
        ',height=' +
        window.innerHeight;
    const callback = config.callback || (() => true);
    // launch window
    const oauthWindow = window.open(url, name, options);
    // cackback
    const oauthInterval = window.setInterval(() => {
      if (oauthWindow && oauthWindow.closed) {
        window.clearInterval(oauthInterval);
        return callback();
      }
    }, 1000);
  }

  getHost() {
    let host: string;
    // get from base tag if it exists
    const baseTags = document.getElementsByTagName('base');
    if (baseTags.length) {
      host = baseTags[0].href;
    } else {
      // else from window.location.href
      const [scheme, domain] = window.location.href.split('/').filter(Boolean);
      host = scheme + '//' + domain;
    }
    return host;
  }
}

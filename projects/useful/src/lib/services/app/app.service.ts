import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export interface AppOptions {
  splashScreen?: boolean | string;
}

/**
 * General app related methods
 */
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private options: AppOptions = {};

  // custom data
  customData: Record<string, unknown> = {};

  // auto data
  host = '';
  viewWidth = 0;
  viewHeight = 0;

  constructor() {}

  setOptions(options: AppOptions) {
    this.options = options;
    return this as AppService;
  }

  setData(customData: Record<string, unknown>) {
    this.customData = customData;
    return this as AppService;
  }

  setDataLoader(dataLoader: Observable<Record<string, unknown>>) {
    dataLoader.pipe(take(1)).subscribe(remoteData => this.customData = {
      ...this.customData,
      ...remoteData,
    });
    return this as AppService;
  }

  init() {
    // set app host
    this.setHost();
    // set viewport
    window.addEventListener('resize', () => this.setViewport());
    this.setViewport();
    // done
    return this as AppService;
  }

  getData<Value>(key: string) {
    return (this.customData || {})[key] as Value;
  }

  addData(data: Record<string, unknown>) {
    this.customData = {...data, ...(this.customData || {})};
    return this as AppService;
  }

  share(title?: string, text?: string, url?: string) {
    if (title && text && url) {
      if (navigator.share) {
        return navigator.share({ title, text, url });
      } else {
        return window.prompt('Please copy and share the url:', url);
      }
    } else {
      throw new Error('No title or description or url for sharing.');
    }
  }

  hideSplashScreen() {
    if (this.options.splashScreen) {
      const elm = document.getElementById(
        typeof this.options.splashScreen === 'string'
          ? this.options.splashScreen
          : 'app-splash-screen'
      );
      if (elm) {
        elm.classList.add('hidden');
        setTimeout(() => elm.parentNode?.removeChild(elm), 1000);
      }
    }
  }

  private setHost() {
    const baseHref = ((document.getElementsByTagName('base')[0] || {})['href'] || '').slice(0, -1);
    if (baseHref) {
      this.host = baseHref;
    } else {
      const hrefSplit = window.location.href.split('/').filter(Boolean);
      this.host = hrefSplit[0] + '//' + hrefSplit[1];
    }
  }

  private setViewport() {
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
    document.documentElement.style
      .setProperty('--app-view-width', `${this.viewWidth}px`);
    document.documentElement.style
      .setProperty('--app-view-height', `${this.viewHeight}px`);
  }
}

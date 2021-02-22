import { Injectable } from '@angular/core';

import { MetaService } from '../meta/meta.service';

export interface AppOptions {
  customData?: Record<string, unknown>;
  splashScreen?: boolean | string;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private options: AppOptions = {};

  private host = '';
  private viewWidth = 0;
  private viewHeight = 0;

  constructor(private metaService: MetaService) {}

  init(options: AppOptions = {}) {
    this.options = options;
    // mark app loaded ok (prevent timeout - unsupported message)
    if (this.options.splashScreen) {
      this.getSplashScreenElement().classList.add('has-app');
    }
    // set app host
    this.setHost();
    // set viewport
    window.addEventListener('resize', () => this.setViewport());
    this.setViewport();
  }

  get HAS_SPLASHSCREEN() {
    return this.options.splashScreen;
  }

  get CUSTOM_DATA() {
    return this.options.customData;
  }

  get HOST() {
    return this.host;
  }

  get VIEW_WIDTH() {
    return this.viewWidth;
  }

  get VIEW_HEIGHT() {
    return this.viewHeight;
  }

  getData<Value>(key: string) {
    return (this.options.customData || {})[key] as Value;
  }

  addData(data: Record<string, unknown>) {
    this.options.customData = {...data, ...(this.options.customData || {})};
    return this as AppService;
  }

  shareApp() {
    const {title, description: text, url} = this.metaService.DEFAULTS;
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

  showSplashScreen() {
    const elm = this.getSplashScreenElement();
    elm.classList.remove('hidden');
    elm.style.display = 'flex';
  }

  hideSplashScreen() {
    const elm = this.getSplashScreenElement();
    elm.classList.add('hidden');
    setTimeout(() => elm.style.display = 'none', 700);
  }

  private getSplashScreenElement() {
    const id = typeof this.options.splashScreen === 'string'
      ? this.options.splashScreen
      : 'app-splash-screen';
    const elm = document.getElementById(id);
    if (!this.options.splashScreen || !elm) {
      throw new Error('No in-app splash screen by the id #' + id);
    }
    return elm;
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

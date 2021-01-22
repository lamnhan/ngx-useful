import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private options: {[name: string]: unknown} = {};
  private meta: {[name: string]: unknown} = {};

  constructor() {}

  init<
    AppOptions extends Record<string, unknown>,
    AppMeta extends Record<string, unknown>
  >(
    options?: AppOptions,
    meta?: AppMeta
  ) {
    // save options
    this.options = { ...this.options, ...options };
    // save meta
    this.meta = { ...this.meta, ...meta };
    // built-in meta
    this.loadDemension();
    this.loadHost();
  }

  get OPTIONS() {
    return this.options;
  }
  getOptions() {
    return this.OPTIONS;
  }

  get META() {
    return this.meta;
  }
  getMeta() {
    return this.META;
  }

  get VIEW_WIDTH() {
    return this.meta.viewWidth || 0;
  }
  getViewWidth() {
    return this.VIEW_WIDTH;
  }

  get VIEW_HEIGHT() {
    return this.meta.viewHeight || 0;
  }
  getViewHeight() {
    return this.VIEW_HEIGHT;
  }

  get HOST() {
    return this.meta.host || '';
  }
  getHost() {
    return this.HOST;
  }

  private loadDemension() {
    const setViewport = () => {
      this.meta.viewWidth = window.innerWidth;
      this.meta.viewHeight = window.innerHeight;
    };
    window.addEventListener('resize', setViewport);
    setViewport();
  }

  private loadHost() {
    const baseHref = ((document.getElementsByTagName('base')[0] || {})['href'] || '').slice(0, -1);
    if (!!baseHref) {
      this.meta.host = baseHref;
    } else {
      const hrefSplit = window.location.href.split('/').filter(Boolean);
      this.meta.host = hrefSplit[0] + '//' + hrefSplit[1];
    }
  }

}

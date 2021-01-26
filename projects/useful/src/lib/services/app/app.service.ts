import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private data: {[key: string]: unknown} = {};

  constructor() {}

  init(
    data: Record<string, unknown> = {}
  ) {
    this.data = { ...this.data, ...data };
    // built-in meta
    this.setViewPort();
    this.setHost();
  }

  get DATA() {
    return this.data;
  }
  getOptions() {
    return this.DATA;
  }

  get VIEW_WIDTH() {
    return this.data.viewWidth || 0;
  }
  getViewWidth() {
    return this.VIEW_WIDTH;
  }

  get VIEW_HEIGHT() {
    return this.data.viewHeight || 0;
  }
  getViewHeight() {
    return this.VIEW_HEIGHT;
  }

  get HOST() {
    return this.data.host || '';
  }
  getHost() {
    return this.HOST;
  }

  private setViewPort() {
    const setViewportHandler = () => {
      this.data.viewWidth = window.innerWidth;
      this.data.viewHeight = window.innerHeight;
    };
    window.addEventListener('resize', setViewportHandler);
    setViewportHandler();
  }

  private setHost() {
    const baseHref = ((document.getElementsByTagName('base')[0] || {})['href'] || '').slice(0, -1);
    if (!!baseHref) {
      this.data.host = baseHref;
    } else {
      const hrefSplit = window.location.href.split('/').filter(Boolean);
      this.data.host = hrefSplit[0] + '//' + hrefSplit[1];
    }
  }
}

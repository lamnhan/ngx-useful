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

  getData() {
    return this.data;
  }

  getViewWidth() {
    return this.data.viewWidth || 0;
  }

  getViewHeight() {
    return this.data.viewHeight || 0;
  }

  getHost() {
    return this.data.host || '';
  }

  changeTheme(name?: string) {
    return name
      ? document.body.setAttribute('data-theme', name)
      : document.body.removeAttribute('data-theme');
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

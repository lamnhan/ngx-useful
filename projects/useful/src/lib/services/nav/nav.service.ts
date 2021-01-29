import { Injectable } from '@angular/core';
import {
  Router,
  Event,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
  NavigationExtras
} from '@angular/router';

import { AppService, AppCustomMetas } from '../app/app.service';

export type NavRouterEventHooks = 'RouteConfigLoadStart' | 'RouteConfigLoadEnd' | 'NavigationEnd';

export interface NavItem {
  text?: string;
  html?: string;
  icon?: string;
  classes?: string | string[];
  level?: number;
  separator?: true;
  segment?: string; // inner link
  href?: string; // normal link
  target?: string;
  routerLink?: string | string[]; // router link
  handler?: (...args: unknown[]) => void; // click
}

export interface NavMenuItem extends NavItem {
  subItems?: NavMenuItem[];
}

export type NavMetaModifier =
  | string
  | { (input: Record<string, unknown>): string };

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private router?: Router;
  private routingData: Record<string, unknown> = {};
  private routingMetaRecords: Record<string, AppCustomMetas> = {};

  private loading = false;
  private previousUrls: string[] = [];

  constructor(private appService: AppService) {}

  init(
    router: Router,
    hooks: {
      [key in NavRouterEventHooks]?: (event: Event) => void;
    } = {},
  ) {
    // set router
    this.router = router;
    // register events
    this.router
      .events
      .subscribe(async event => {
      let eventName = '' as NavRouterEventHooks; // event name
      if (event instanceof RouteConfigLoadStart) {
        eventName = 'RouteConfigLoadStart';
        this.loading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        eventName = 'RouteConfigLoadEnd';
        setTimeout(() => { this.loading = false; }, 1000);
      } else if (event instanceof NavigationEnd) {
        eventName = 'NavigationEnd';
        // record urls for backing navigation
        const url = event.urlAfterRedirects;
        const backUrl = this.previousUrls[this.previousUrls.length - 2];
        if (!backUrl || (backUrl && url !== backUrl)) {
          this.previousUrls.push(url);
        } else {
          this.previousUrls.pop();
        }
        // set title & meta
        this.appService.changePageMetas(
          this.routingMetaRecords[(this.router as Router).url] || {}
        );
      }
      // run hook
      const hook = hooks[eventName] || ((e: Event) => e);
      hook(event);
    });
    return this as NavService;
  }

  getRouter() {
    if (!this.router) {
      throw new Error('No router, please set first!');
    }
    return this.router;
  }

  setMeta(
    input: Record<string, unknown>,
    modifiers: Record<string, NavMetaModifier> = {}
  ) {
    const customMetas = this.extractCustomMetas(input, modifiers);
    if (this.router && !this.routingMetaRecords[this.router.url]) {
      this.routingMetaRecords[this.router.url] = customMetas;
    }
    return this as NavService;
  }

  get(key?: string) {
    return key ? this.routingData[key] : this.routingData;
  }

  isLoading() {
    return this.loading;
  }

  isBacking() {
    return this.router
      && this.previousUrls.length > 1
      && this.router.url !== ''
      && this.router.url !== '/';
  }

  back() {
    const [ path, ... queryStringArr ] = (this.previousUrls[this.previousUrls.length - 2] || '/').split('?');
    // query params
    const queryParams = {} as Record<string, unknown>;
    if (queryStringArr.length) {
      const queryItems = queryStringArr.join('?').split('&');
      for (const queryItem of queryItems) {
        const [ key, value ] = queryItem.split('=');
        if (key && value) {
          queryParams[key] = value;
        }
      }
    }
    // navigate
    return this.navigate([ path ], {}, { queryParams });
  }

  navigate(
    route: string[],
    data: Record<string, unknown> = {},
    navigationExtras: NavigationExtras,
  ) {
    this.routingData = data; // set route data
    return this.getRouter().navigate(route, navigationExtras);
  }

  scrollToTop() {
    const bodyElm = document.getElementsByTagName('body').item(0);
    return this.scrollTo(bodyElm as HTMLElement);
  }

  scrollTo(input: string | HTMLElement) {
    const elm = typeof input === 'string'
      ? document.getElementById(input)
      : input;
    return elm?.scrollIntoView({ behavior: 'smooth' });
  }

  private extractCustomMetas(
    input: Record<string, unknown>,
    modifiers: Record<string, NavMetaModifier> = {}
  ) {
    const getMetaValue = (fieldName: string) => {
      const modifier = modifiers[fieldName];
      return modifier && modifier instanceof Function
        ? modifier(input)
        : input[modifier || fieldName] as string;
    };
    const title = getMetaValue('title');
    const description = getMetaValue('description');
    const image = getMetaValue('image');
    let url = getMetaValue('url') || window.document.URL;
    url = url.substr(-1) === '/' ? url : (url + '/');
    const author = getMetaValue('author');
    const twitterCard = getMetaValue('twitterCard');
    const twitterCreator = getMetaValue('twitterCreator');
    const ogType = getMetaValue('ogType');
    const ogLocale = getMetaValue('ogLocale');
    return {
      title,
      description,
      image,
      url,
      author,
      twitterCard,
      twitterCreator,
      ogType,
      ogLocale
    } as AppCustomMetas;
  }
}

import { Injectable } from '@angular/core';
import {
  Router,
  Event,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
  NavigationExtras
} from '@angular/router';

import { MetaService, AppCustomMetas } from '../meta/meta.service';

export type NavRouterEventHooks = 'RouteConfigLoadStart' | 'RouteConfigLoadEnd' | 'NavigationEnd';

export interface NavItem {
  text?: string;
  shortText?: string;
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

export interface MenuItem extends NavItem {
  subItems?: MenuItem[];
}

export type NavMetaModifier =
  | string
  | { (input: Record<string, unknown>): string };

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private routingData: Record<string, unknown> = {};
  private routingMetaRecords: Record<string, AppCustomMetas> = {};

  private loading = false;
  private loadingIndicatorTimeout?: any;
  private previousUrls: string[] = [];
  private isMenuVisible = false; // secondary/mobile menu

  constructor(
    private router: Router,
    private metaService: MetaService,
  ) {}

  init(
    hooks: {
      [key in NavRouterEventHooks]?: (event: Event) => void;
    } = {},
  ) {
    // register events
    this.router
      .events
      .subscribe(async event => {
      let eventName = '' as NavRouterEventHooks; // event name
      if (event instanceof RouteConfigLoadStart) {
        eventName = 'RouteConfigLoadStart';
        // show loading indicator (longer than 1s)
        this.loadingIndicatorTimeout =
          setTimeout(() => this.showLoadingIndicator(), 1000);
      } else if (event instanceof RouteConfigLoadEnd) {
        eventName = 'RouteConfigLoadEnd';
        // hide loadding
        if (this.loadingIndicatorTimeout) {
          clearTimeout(this.loadingIndicatorTimeout);
          setTimeout(() => this.hideLoadingIndicator(), 1000);
        }
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
        this.metaService.changePageMetas(
          this.routingMetaRecords[(this.router as Router).url] || {}
        );
      }
      // run hook
      const hook = hooks[eventName] || ((e: Event) => e);
      hook(event);
    });
    return this as NavService;
  }

  get ROUTER() {
    if (!this.router) {
      throw new Error('No router, please set first!');
    }
    return this.router;
  }

  get DATA() {
    return this.routingData;
  }

  get IS_LOADING() {
    return this.loading;
  }

  get IS_BACKABLE() {
    return this.router
      && this.previousUrls.length > 1
      && this.router.url !== ''
      && this.router.url !== '/';
  }
  
  get IS_MENU_VISIBLE() {
    return this.isMenuVisible;
  }

  get MENU_ICON() {
    return this.menuIcon();
  }

  menuIcon(menuCls = 'icon-menu', backCls = 'icon-back') {
    return this.IS_BACKABLE ? backCls : menuCls;
  }

  get(key?: string) {
    return key ? this.routingData[key] : this.routingData;
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

  showLoadingIndicator() {
    this.loading = true;
  }

  hideLoadingIndicator() {
    this.loading = false;
  }

  menuAction() {
    return this.IS_BACKABLE
      ? this.back()
      : this.toggleMenu();
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
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
    route: string | string[],
    data: Record<string, unknown> = {},
    navigationExtras?: NavigationExtras,
  ) {
    this.routingData = data; // set route data
    return this.ROUTER.navigate(
      typeof route === 'string' ? [route] : route,
      navigationExtras
    );
  }

  scrollToTop() {
    return this.scrollTo(document.body);
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

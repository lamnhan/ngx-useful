import { Injectable } from '@angular/core';
import {
  Router,
  Route,
  Routes,
  Event,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
  NavigationExtras
} from '@angular/router';

import { MetaService, AppCustomMetas } from '../meta/meta.service';
import { SettingService } from '../setting/setting.service';

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

export interface RouteTranslations {
  [path: string]: Record<string, true | string>;
}

export interface I18nRoutingItem {
  [local: string]: string[];
}

export interface I18nRouting {
  [init: string]: I18nRoutingItem;
}

export function i18nRoutes(
  routes: Routes,
  routeTranslations: RouteTranslations,
  homeRoute: Route,
  oopsRoute?: Route
): Routes {
  const allRoutes: Routes = [];
  // home
  allRoutes.push(homeRoute);
  // routes
  routes.forEach(route => {
    // main
    allRoutes.push(route);
    // localizations
    const translation = routeTranslations[route.path as string];
    if (translation) {
      Object.keys(translation).forEach(locale => {
        const localizedPath = translation[locale];
        if (localizedPath !== true) {
          allRoutes.push({ ...route, path: localizedPath });
        }
      });
    }
  });
  // oops
  if (oopsRoute) {
    allRoutes.push(oopsRoute);
  }
  // result
  return allRoutes;
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private routingData: Record<string, unknown> = {};
  private routingMetaRecords: Record<string, AppCustomMetas> = {};

  // general
  private loading = false;
  private loadingIndicatorTimer?: any;
  private previousUrls: string[] = [];
  private isMenuVisible = false; // secondary/mobile menu

  // i18n
  private isI18n = false;
  private i18nRouting: I18nRouting = {};

  constructor(
    private router: Router,
    private metaService: MetaService,
    private settingService: SettingService,
  ) {}

  init(
    i18nRegistry?: { routes: Routes; routeTranslations: RouteTranslations; },
    hooks: { [key in NavRouterEventHooks]?: (event: Event) => void; } = {},
  ) {
    // handle i18n
    if (i18nRegistry) {
      this.isI18n = true;
      // process
      const { routes, routeTranslations } = i18nRegistry;
      routes.forEach(route => {
        const routingItem: I18nRoutingItem = {};
        // proccess translate
        const path = route.path as string;
        const pathMap = path.split('/').filter(x => !!x);
        const translation = routeTranslations[path];
        if (translation) {
          Object.keys(translation).forEach(locale => {
            const localizedPath = translation[locale];
            routingItem[locale] =
              localizedPath !== true
              ? localizedPath.split('/').filter(x => !!x)
              : pathMap;
          });
        }
        // save
        this.i18nRouting[pathMap[0]] = routingItem;
      });
    }
    // register events
    this.router
      .events
      .subscribe(async event => {
      let eventName = '' as NavRouterEventHooks; // event name
      if (event instanceof RouteConfigLoadStart) {
        eventName = 'RouteConfigLoadStart';
        // show loading indicator (longer than 1s)
        this.loadingIndicatorTimer =
          setTimeout(() => this.showLoadingIndicator(), 1000);
      } else if (event instanceof RouteConfigLoadEnd) {
        eventName = 'RouteConfigLoadEnd';
        // hide loadding
        if (this.loadingIndicatorTimer) {
          clearTimeout(this.loadingIndicatorTimer);
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
    return this.getMenuIcon();
  }

  getMenuIcon(menuClass = 'icon-menu', backClass = 'icon-back') {
    return this.IS_BACKABLE ? backClass : menuClass;
  }

  getRouteStr(input: string | string[], withLocale?: string) {
    return this.getRoute(input, withLocale).join('/');
  }

  getRoute(input: string | string[], withLocale?: string) {
    // home
    if (input.length === 0 || input[0] === '' || input[0] === '/') {
      return [''];
    }
    // no i18n
    else if (!this.isI18n) {
      return typeof input === 'string' ? input.split('/') : input;
    }
    // get i18n
    else {
      const locale = withLocale || this.settingService.LOCALE;
      const inputMap = typeof input === 'string'
        ? input.split('/').filter(x => !!x)
        : input;
      const pathMap = (this.i18nRouting[inputMap[0]] || {})[locale];
      const route = pathMap
        ? inputMap.map((inputValue, i) => pathMap[i].startsWith(':') ? inputValue : pathMap[i])
        : inputMap;
      return route;
    }
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
    return this.router.navigate([ path ], { queryParams });
  }

  navigate(
    input: string | string[],
    navigationExtras?: NavigationExtras,
    data: Record<string, unknown> = {},
    withLocale?: string,
  ) {
    this.routingData = data;
    return this.router.navigate(this.getRoute(input, withLocale), navigationExtras);
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

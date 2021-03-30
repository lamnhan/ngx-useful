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
import { ReplaySubject } from 'rxjs';

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

export interface NavHistoryItem {
  url: string;
  title?: string;
  data?: Record<string, unknown>;
}

export interface NavConfig {
  extras?: NavigationExtras;
  title?: string;
  data?: Record<string, unknown>;
  withLocale?: string;
  enableBackward?: boolean;
}

export interface NavOptions {
  i18nRedirect?: boolean
}

export interface NavIntegrations {
  settingService?: SettingService;
}

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
  private options: NavOptions = {};
  private integrations: NavIntegrations = {};

  // general
  private loading = false;
  private loadingIndicatorTimer?: any;
  private isMenuVisible = false; // secondary/mobile menu
  private backwardEnabled = false;

  // current props
  private routeTitle?: string;
  private routeData?: Record<string, unknown>;

  // history
  private previousRoutes: NavHistoryItem[] = [];

  // i18n
  private i18nRouting?: I18nRouting;
  private i18nOrigins: Record<string, string> = {};
  public readonly onRefreshRouterLink = new ReplaySubject<void>(1);

  constructor(private readonly router: Router) {}

  init(
    options: NavOptions = {},
    integrations: NavIntegrations = {},
    hooks: {[key in NavRouterEventHooks]?: (event: Event) => void} = {},
    i18nRegistry?: {
      routes: Routes;
      routeTranslations: RouteTranslations
    },
  ) {
    this.options = options;
    this.integrations = integrations;
    // handle i18n
    if (i18nRegistry) {
      // has i18n
      this.i18nRouting = {};
      // process routes / translations
      const { routes, routeTranslations } = i18nRegistry;
      routes.forEach(route => {
        const path = route.path as string;
        const pathMap = path.split('/').filter(value => !!value);
        const translation = routeTranslations[path];
        // proccess translations
        const routingItem: I18nRoutingItem = {};
        if (translation) {
          Object.keys(translation).forEach(locale => {
            const localizedPath = translation[locale];
            if (localizedPath === true) {
              // routing item
              routingItem[locale] = pathMap;
              // save origins
              this.i18nOrigins[pathMap[0]] = locale;
            } else {
              // routing item
              const localizedPathMap = localizedPath.split('/').filter(value => !!value);
              routingItem[locale] = localizedPathMap;
              // save origins
              this.i18nOrigins[localizedPathMap[0]] = locale;
            }
          });
        }
        // save original/localized routing
        Object.keys(routingItem).forEach(locale => {
          const localizedPathMap = routingItem[locale];
          (this.i18nRouting as I18nRouting)[localizedPathMap[0]] = routingItem;
        });
      });
      // watch for locale
      if (this.integrations.settingService && this.options.i18nRedirect) {
        this.integrations.settingService.onLocaleChanged.subscribe(locale => {
          // refresh router link
          this.onRefreshRouterLink.next();
          // redirect i18n route
          const url = this.router.url;
          const pathInit = url.substr(1).split('/').shift() as string;
          if (pathInit !== '' && this.i18nOrigins[pathInit] !== locale) {
            this.navigate(url, { withLocale: locale });
          }
        });
      }
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
        // refresh router link
        this.onRefreshRouterLink.next();
        // record urls for backward navigation
        if (this.backwardEnabled) {
          const url = event.urlAfterRedirects;
          const backwardRoute = this.previousRoutes[this.previousRoutes.length - 2];
          if (
            !backwardRoute?.url
            || (
              backwardRoute?.url
              && url !== backwardRoute?.url
            )
          ) {
            this.previousRoutes.push({
              url,
              title: this.routeTitle,
              data: this.routeData,
            });
          } else {
            this.previousRoutes.pop();
          }
        }
      }
      // run hook
      const hook = hooks[eventName] || ((e: Event) => e);
      hook(event);
    });
    // done
    return this as NavService;
  }

  get TITLE() {
    return this.routeTitle;
  }

  get DATA() {
    return this.routeData;
  }

  get IS_LOADING() {
    return this.loading;
  }

  get IS_BACKWARDABLE() {
    return this.backwardEnabled
      && this.previousRoutes.length > 1
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
    return this.IS_BACKWARDABLE ? backClass : menuClass;
  }

  getRouteUrl(input: string | string[], withLocale?: string) {
    return this.getRoute(input, withLocale).join('/');
  }

  getRoute(input: string | string[], withLocale?: string) {
    // home
    if (
      input.length === 0
      || input[0] === ''
      || (
        input.length === 1
        && input[0] === '/'
      )
    ) {
      return [''];
    }
    // no i18n
    else if (!this.i18nRouting) {
      return typeof input === 'string' ? input.split('/') : input;
    }
    // get i18n
    else {
      const locale = withLocale
        || this.integrations?.settingService?.LOCALE
        || 'en-US';
      const inputMap = (typeof input === 'string'
        ? input.split('/')
        : input.map(value => value.startsWith('/') ? value.substr(1) : value)
      ).filter(value => !!value);
      const pathMap = (this.i18nRouting[inputMap[0]] || {})[locale];
      const route = pathMap
        ? inputMap.map((inputValue, i) => pathMap[i].startsWith(':') ? inputValue : pathMap[i])
        : inputMap;
      return route;
    }
  }

  showLoadingIndicator() {
    this.loading = true;
  }

  hideLoadingIndicator() {
    this.loading = false;
  }

  menuAction() {
    return this.IS_BACKWARDABLE
      ? this.back()
      : this.toggleMenu();
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  isActive(url: string, exact = false) {
    return this.router.isActive(url, exact);
  }

  back() {
    const { url = '/', title, data } = this.previousRoutes[this.previousRoutes.length - 2] || {};
    // const [ path, ... queryStringArr ] = (url || '/').split('?');
    // // query params
    // const queryParams = {} as Record<string, unknown>;
    // if (queryStringArr.length) {
    //   const queryItems = queryStringArr.join('?').split('&');
    //   for (const queryItem of queryItems) {
    //     const [ key, value ] = queryItem.split('=');
    //     if (key && value) {
    //       queryParams[key] = value;
    //     }
    //   }
    // }
    // navigate
    return this.navigate(url, {title, data});
  }

  navigate(input: string | string[], config: NavConfig = {}) {
    const {title, data, enableBackward, withLocale, extras} = config;
    // set values
    this.routeTitle = title;
    this.routeData = data;
    this.backwardEnabled = !!enableBackward;
    // reset history
    if (!this.backwardEnabled) {
      this.previousRoutes = [];
    }
    // do navigate
    return this.router.navigate(this.getRoute(input, withLocale), extras);
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
}

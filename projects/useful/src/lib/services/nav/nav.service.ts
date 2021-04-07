import { Injectable, NgZone } from '@angular/core';
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
import { Observable, ReplaySubject } from 'rxjs';

import { SettingService } from '../setting/setting.service';

export type NavRouterEventHooks = 'RouteConfigLoadStart' | 'RouteConfigLoadEnd' | 'NavigationEnd';

export interface NavItem {
  name?: string;
  text?: string;
  shortText?: string;
  html?: string;
  classes?: string | string[];
  icon?: string;
  level?: number;
  separator?: true;
  segment?: string; // inner link
  href?: string; // normal link
  target?: string;
  handler?: (...args: unknown[]) => void; // click
  routerLink?: string | string[] | Observable<string | string[]>; // router link
  activeClasses?: string | string[];
  activeIcon?: string;
  activeAlso?: string[];
}

export interface MenuItem extends NavItem {
  subItems?: MenuItem[];
}


export interface NavRouteProps {
  title?: string;
  data?: Record<string, unknown>;
  extras?: NavigationExtras;
}

export interface NavHistoryItem extends NavRouteProps {
  url: string;
}

export interface NavAdvanced extends NavRouteProps {
  locale?: string;
  backwardable?: boolean;
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
  loading = false;
  menuVisible = false; // secondary/mobile menu
  private loadingIndicatorTimer?: any;
  private backwardEnabled = false;

  // current props
  routeUrl = '/';
  routeTitle?: string;
  routeData?: Record<string, unknown>;
  routeExtras?: NavigationExtras;

  // history
  private previousRoutes: NavHistoryItem[] = [];

  // i18n
  private i18nRouting?: I18nRouting;
  private i18nOrigins: Record<string, string> = {};
  public readonly onRefreshRouterLink = new ReplaySubject<void>(1);

  constructor(
    private readonly ngZone: NgZone,
    private readonly router: Router,
  ) {}

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
      const { routes, routeTranslations } = i18nRegistry;
      // process routes / translations
      this.i18nRouting = {};
      routes.forEach(route => {
        const path = route.path as string;
        const pathMap = path.split('/').filter(value => !!value);
        const translation = routeTranslations[path];
        const routingItem: I18nRoutingItem = {};
        // proccess translations
        if (translation) {
          Object.keys(translation).forEach(locale => {
            const localizedPath = translation[locale];
            if (localizedPath === true) {
              routingItem[locale] = pathMap;
              this.i18nOrigins[pathMap[0]] = locale;
            } else {
              const localizedPathMap = localizedPath.split('/').filter(value => !!value);
              routingItem[locale] = localizedPathMap;
              this.i18nOrigins[localizedPathMap[0]] = locale;
            }
          });
        }
        // save original/localized routing
        Object.keys(routingItem).forEach(locale => {
          const init = routingItem[locale][0];
          if (!this.i18nRouting?.[init]) {
            (this.i18nRouting as I18nRouting)[init] = routingItem;
          }
        });
      });
      // watch for locale
      if (this.options.i18nRedirect && this.integrations.settingService) {
        this.integrations.settingService.onLocaleChanged.subscribe(locale => {
          // refresh router link
          this.onRefreshRouterLink.next();
          // redirect i18n route
          const {url, extras} = this.parseRouterUrl(this.router.url);
          const pathInit = url.substr(1).split('/').shift() as string;
          if (pathInit !== '' && this.i18nOrigins[pathInit] !== locale) {
            this.ngZone.run(() => this.navigate(url, {extras, locale, backwardable: false}));
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
        // set route url
        this.routeUrl = this.router.url;
        // refresh router link
        this.onRefreshRouterLink.next();
        // record urls for backward navigation
        if (this.backwardEnabled) {
          const activeUrl = event.urlAfterRedirects;
          const backwardRoute = this.previousRoutes[this.previousRoutes.length - 2];
          if (
            !backwardRoute?.url
            || (
              backwardRoute?.url
              && activeUrl !== backwardRoute?.url
            )
          ) {
            this.previousRoutes.push({
              url: activeUrl,
              title: this.routeTitle,
              data: this.routeData ? {...this.routeData} : undefined,
              extras: this.routeExtras ? {...this.routeExtras} : undefined,
            });
          } else {
            this.previousRoutes.pop();
          }
          // reset backwardable
          if (this.previousRoutes.length <= 1) {
            this.previousRoutes = [];
            this.backwardEnabled = false;
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

  isActive(url: string, exact = false) {
    return this.router.isActive(url, exact);
  }

  isRouteActive(input: string | string[], exact = false, withLocale?: string) {
    const url = this.getRouteUrl(input, withLocale);
    return this.isActive(url, exact);
  }

  isBackwardable() {
    return this.backwardEnabled
      && this.previousRoutes.length > 1
      && this.router.url !== ''
      && this.router.url !== '/';
  }

  getMenuIcon(menuClass = 'icon-menu', backClass = 'icon-back') {
    return this.isBackwardable() ? backClass : menuClass;
  }

  showLoadingIndicator() {
    this.loading = true;
  }

  hideLoadingIndicator() {
    this.loading = false;
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
      const locale = withLocale || this.integrations.settingService?.locale || 'en-US';
      const inputMap = (typeof input === 'string'
        ? input.split('/')
        : input.map(value => value.startsWith('/') ? value.substr(1) : value)
      ).filter(value => !!value);
      const pathMap = (this.i18nRouting[inputMap[0]] || {})[locale];
      const route = pathMap
        ? inputMap.map((inputValue, i) =>
          (pathMap[i] || ':').startsWith(':') ? inputValue : pathMap[i])
        : inputMap;
      return route;
    }
  }

  getRouteUrl(input: string | string[], withLocale?: string) {
    return this.getRoute(input, withLocale).join('/');
  }

  menuAction() {
    return this.isBackwardable() ? this.back() : this.toggleMenu();
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  back() {
    const backwardRoute = this.previousRoutes[this.previousRoutes.length - 2];
    if (!backwardRoute) {
      return;
    }
    const { url, title, data, extras } = backwardRoute;
    return this.navigate(url, {title, data, extras});
  }

  navigate(input: string | string[], advanced: NavAdvanced = {}) {
    const {title, data, extras, backwardable, locale } = advanced;
    // handle backward navigation
    if (backwardable !== undefined) {
      this.backwardEnabled = backwardable;
    }
    if (!this.backwardEnabled) {
      this.previousRoutes = []; // reset history
    } else if (!this.previousRoutes.length) {
      // initial history (add current route as the first item)
      this.previousRoutes.push({
        url: this.router.url,
        title: this.routeTitle,
        data: this.routeData ? {...this.routeData} : undefined,
        extras: this.routeExtras ? {...this.routeExtras} : undefined,
      });
    }
    // set values
    this.routeTitle = title;
    this.routeData = data;
    this.routeExtras = extras;
    // do navigate
    return this.router.navigate(this.getRoute(input, locale), extras);
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

  private parseRouterUrl(routerUrl: string) {
    const urlData = new URL(`https://lamnhan.com${routerUrl}`);
    const url = urlData.pathname;
    const fragment = urlData.hash ? urlData.hash.replace('#', '') : undefined;
    const queryParams = {} as Record<string, string>;
    urlData.searchParams.forEach((value, key) => queryParams[key] = value);
    const extras = { fragment, queryParams };
    return { url, extras };
  }
}

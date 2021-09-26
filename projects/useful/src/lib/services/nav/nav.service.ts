import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
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
  position?: number;
  extras?: NavigationExtras;
}

export interface NavHistoryItem extends NavRouteProps {
  url: string;
  position: number;
}

export interface NavAdvanced extends NavRouteProps {
  locale?: string;
  backwardable?: boolean;
}

export interface NavOptions {
  globalOffset?: number;
  menuIcon?: string;
  backIcon?: string;
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
  oopsRoute?: Route,
  localizedHomeRoutes?: boolean
): Routes {
  const allRoutes: Routes = [];
  // home
  allRoutes.push(homeRoute);
  // special localized home
  if (localizedHomeRoutes) {
    Object
      .keys(routeTranslations[Object.keys(routeTranslations)[0]])
      .forEach(locale => {
        const localeLoweCased = locale.toLowerCase();
        const [languageCode, countryCode] = localeLoweCased.split('-');
        allRoutes.push(
          {...homeRoute, path: locale},
          {...homeRoute, path: localeLoweCased},
          {...homeRoute, path: languageCode},
          {...homeRoute, path: countryCode}
        );
      });
  }
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

/**
 * Advanced navigation
 */
@Injectable({
  providedIn: 'root'
})
export class NavService {
  private options: NavOptions = {};
  private integrations: NavIntegrations = {};
  private hooks: {[key in NavRouterEventHooks]?: (event: Event) => void} = {};

  // general
  loading = false;
  menuVisible = false; // secondary/mobile menu
  private loadingIndicatorTimer?: any;
  private backwardEnabled = false;

  // current props
  routeUrl = '/';
  routeTitle?: string;
  routeData?: Record<string, unknown>;
  routePosition = 0;
  routeExtras?: NavigationExtras;

  // util data
  isBackable = false;
  menuIcon!: string;
  
  // history
  private previousRoutes: NavHistoryItem[] = [];

  // i18n
  private i18nLocales: string[] = [];
  private i18nOrigins: Record<string, string> = {};
  private i18nRouting?: I18nRouting;
  public readonly onRefreshRouterLink = new ReplaySubject<void>(1);

  // events
  public readonly onRouteConfigLoadStart = new ReplaySubject<NavService>(1);
  public readonly onRouteConfigLoadEnd = new ReplaySubject<NavService>(1);
  public readonly onNavigationEnd = new ReplaySubject<NavService>(1);

  // change event
  public readonly onChanges = new ReplaySubject<NavService>(1);

  constructor(
    public readonly router: Router,
    public readonly route: ActivatedRoute,
  ) {}

  setOptions(options: NavOptions) {
    this.options = options;
    this.menuIcon = options.menuIcon || 'icon-menu';
    return this as NavService;
  }
  
  setIntegrations(integrations: NavIntegrations) {
    this.integrations = integrations;
    return this as NavService;
  }
  
  setHooks(hooks: {[key in NavRouterEventHooks]?: (event: Event) => void}) {
    this.hooks = hooks;
    return this as NavService;
  }
  
  setI18n(i18nRegistry: { routes: Routes; routeTranslations: RouteTranslations; }) {
    const { routes, routeTranslations } = i18nRegistry;
    // save i18n locales
    this.i18nLocales = Object.keys(routeTranslations[Object.keys(routeTranslations)[0]]);
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
    // watch for locale to update router link href
    if (this.integrations.settingService) {
      this.integrations.settingService.onLocaleChanged
        .subscribe(() => this.onRefreshRouterLink.next());
    }
    return this as NavService;
  }

  init() {
    this.router
      .events
      .subscribe(async event => {
      if (event instanceof RouteConfigLoadStart) {
        // run hook
        (this.hooks?.['RouteConfigLoadStart'] || ((e: Event) => e))(event);
        // show loading indicator (longer than 1s)
        this.loadingIndicatorTimer =
          setTimeout(() => this.showLoadingIndicator(), 1000);
        // emit the event
        this.onRouteConfigLoadStart.next(this);
      } else if (event instanceof RouteConfigLoadEnd) {
        // run hook
        (this.hooks?.['RouteConfigLoadEnd'] || ((e: Event) => e))(event);
        // hide loadding
        if (this.loadingIndicatorTimer) {
          clearTimeout(this.loadingIndicatorTimer);
          setTimeout(() => this.hideLoadingIndicator(), 1000);
        }
        // emit the event
        this.onRouteConfigLoadEnd.next(this);
      } else if (event instanceof NavigationEnd) {
        // run hook
        (this.hooks?.['NavigationEnd'] || ((e: Event) => e))(event);
        // set route url
        this.routeUrl = this.router.url;
        // refresh router link
        this.onRefreshRouterLink.next();
        // record urls for backward navigation
        if (this.backwardEnabled) {
          const { path: activeUrl } = this.parseRouterUrl(event.urlAfterRedirects);
          const backwardRoute = this.previousRoutes[this.previousRoutes.length - 2];
          if (!backwardRoute?.url || activeUrl !== backwardRoute?.url) {
            this.setNavHistory(event.urlAfterRedirects);
          } else {
            this.previousRoutes.pop();
          }
          // reset backwardable
          if (this.previousRoutes.length <= 1) {
            this.previousRoutes = [];
            this.backwardEnabled = false;
          }
        }
        // set initial/prioritized settings
        if (this.integrations.settingService && !this.integrations.settingService.isInitialized) {
          const routeUrl = this.router.url.split('?').shift() as string;
          const pathInit = routeUrl.substr(1).split('/').shift() as string;
          // set prioritized settings for none root path
          if (pathInit !== '') {
            // localized routes
            if (this.i18nOrigins[pathInit]) {
              this.integrations.settingService.setPrioritizedLocale(this.i18nOrigins[pathInit]);
            }
            // special localized homes
            else {
              const localizedHomeRoute = (() => {
                // full matches
                if (pathInit.indexOf('-') !== -1) {
                  // perfect match
                  if(this.i18nLocales.indexOf(pathInit) !== -1) {
                    return pathInit;
                  }
                  // lowercase match
                  const [seg1, seg2] = pathInit.split('-');
                  const posibleALocale = `${seg1}-${seg2.toUpperCase()}`;
                  if(this.i18nLocales.indexOf(posibleALocale) !== -1) {
                    return posibleALocale;
                  }
                }
                // lang code or coutry code matches
                else {
                  const filteredLocales = this.i18nLocales.filter(locale => {
                    const [languageCode, countryCode] = locale.split('-');
                    const countryCodeLowerCased = countryCode.toLowerCase();
                    return pathInit === languageCode || pathInit === countryCodeLowerCased;
                  });
                  if (filteredLocales.length) {
                    return filteredLocales.shift() as string;
                  }
                }
                return null;
              })();
              if (localizedHomeRoute) {
                this.integrations.settingService.setPrioritizedLocale(localizedHomeRoute);
              }
            }
          }
          // set initial settings
          const routeQuery = this.route.snapshot.queryParams;
          const meta = document.querySelector('meta[itemprop="inLanguage"]');
          const prerenderLocale = !meta ? null : meta.getAttribute('content');
          if (
            routeQuery.l
            || routeQuery.locale
            || prerenderLocale
          ) {
            this.integrations.settingService.setInitialLocale(
              routeQuery.l || routeQuery.locale || prerenderLocale
            );
          }
          if (routeQuery.p || routeQuery.persona) {
            this.integrations.settingService.setInitialPersona(routeQuery.p || routeQuery.persona);
          }
          if (routeQuery.t || routeQuery.theme) {
            this.integrations.settingService.setInitialTheme(routeQuery.t || routeQuery.theme);
          }
          // notify the setting service
          this.integrations.settingService.triggerSettingInitilizer();
        }
        // scroll to position
        const positionInterval = setInterval(() => {
          this.scrollTo(this.routePosition, 0, false);
          if (this.routePosition === window.scrollY) {
            clearInterval(positionInterval);
          }
        }, 300);
        setTimeout(() => clearInterval(positionInterval), 3000); // safety timeout
        // emit the event
        this.onNavigationEnd.next(this);
      }
    });
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

  getMenuIcon() {
    return this.isBackwardable()
      ? (this.options.backIcon || 'icon-back')
      : (this.options.menuIcon || 'icon-menu');
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
    if (!backwardRoute) return;
    const { url, title, data, position, extras } = backwardRoute;
    return this.navigate(url, {title, data, position, extras});
  }

  navigate(input: string | string[], advanced: NavAdvanced = {}) {
    const {title, data, position = 0, extras, backwardable, locale } = advanced;
    // handle backward navigation
    if (backwardable !== undefined) {
      this.backwardEnabled = backwardable;
    }
    if (!this.backwardEnabled) {
      this.previousRoutes = []; // reset history
    } else {
      const currentPosition = window.scrollY;
      // initial history (add current route as the first item)
      if (!this.previousRoutes.length) {
        this.setNavHistory(this.router.url, currentPosition);
      }
      // set position for the last route in history 
      else {
        this.previousRoutes[this.previousRoutes.length - 1].position = currentPosition;
      }
    }
    // set values
    this.routeTitle = title;
    this.routeData = data;
    this.routePosition = position;
    this.routeExtras = extras;
    // update data
    this.isBackable = this.isBackwardable();
    this.menuIcon = this.getMenuIcon();
    // emit event
    this.onChanges.next(this);
    // do navigate
    return this.router.navigate(this.getRoute(input, locale), extras);
  }

  updateQueryParams(queryParams: Record<string, string>, merge = true) {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams, 
      ...(merge ? { queryParamsHandling: 'merge' } : {}),
    });
  }

  removeQueryParams() {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: null,
    });
  }

  scrollToTop(offset = 0, smooth = true) {
    return this.scrollTo(0, offset, smooth);
  }

  scrollTo(input: number | string | HTMLElement, offset = 0, smooth = true) {
    const position = (typeof input === 'number' ? input : (typeof input === 'string' ? document.getElementById(input) : input)?.offsetTop) || 0;
    return window.scrollTo({
      top: position + (offset || this.options.globalOffset || 0),
      behavior: smooth ? 'smooth' : 'instant' as any,
    });
  }

  private setNavHistory(routerUrl: string, position = 0) {
    const { path, queryParams } = this.parseRouterUrl(routerUrl);
    return this.previousRoutes.push({
      url: path,
      position,
      title: this.routeTitle,
      data: !this.routeData ? undefined : {...this.routeData},
      extras:
        !this.routeExtras && !queryParams
          ? undefined
          : { ...this.routeExtras, queryParams },
    });
  }

  private parseRouterUrl(routerUrl: string) {
    const [path, query] = routerUrl.split('?');
    const queryParams = !query
      ? undefined
      : query
        .split('&')
        .reduce(
          (result, item) => {
            const [key, value] = item.split('=');
            result[key] = value;
            return result;
          },
          {} as Record<string, string>
        );
    return { path, queryParams };
  }
}

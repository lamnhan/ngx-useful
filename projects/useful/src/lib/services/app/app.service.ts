import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Observable, of, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';

export interface AppCustomMetas {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  twitterCard?: string;
  twitterCreator?: string;
  ogType?: string;
  ogLocale?: string;
}

export interface AppMetas extends AppCustomMetas {
  twitterSite?: string;
  ogSiteName?: string;
  fbAppId?: string;
}

export interface AppOptions {
  /**
   * Custom data to use in app
   */
  customData?: Record<string, unknown>;
  /**
   * Support local settings
   */
  localSettings?: boolean;
  /**
   * If your app has in-app splash screen
   */
  splashScreen?: boolean;
  /**
   * Set theme based on browser color schema
   */
  browserColor?: boolean;
  /**
   * Enable PWA supports
   */
  pwa?: boolean;
  /**
   * App has PWA installing reminder
   */
  pwaReminder?: boolean;
  /**
   * Don't show again for X minutes, default: 12 hours
   */
  pwaReminderEvery?: number;
  /**
   * Don't annoy your user, only ask for certain times
   */
  pwaReminderMax?: number;
  /**
   * Custom normal settings loader
   */
  settingsLoader?: () => Observable<BuiltinSettings>,
  /**
   * Custom UI intensive settings
   */
  settingsLoaderUI?: () => Observable<BuiltinUISettings>,
}

export type PWAStatus =
  | 'installed' // standalone or installed implicitly
  | 'available' // can be asked now
  | 'unavailable'; // already asked

export interface BuiltinSettings {
  pwaStatus?: PWAStatus;
}

export interface BuiltinUISettings {
  theme?: string;
}

export interface AppSettings extends BuiltinSettings, BuiltinUISettings {}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private readonly LSK_PWA_REMINDER_TIMESTAMP = 'pwa_reminder_timestamp';
  private readonly LSK_PWA_REMINDER_COUNT = 'pwa_reminder_count';
  private readonly LSK_THEME = 'theme';
  private readonly LSK_PWA_STATUS = 'pwa_status';

  // app options
  private options: AppOptions = {};

  // default meta values
  private defaultMetas: AppMetas = {};

  // built-in data
  private host = '';
  private viewWidth = 0;
  private viewHeight = 0;

  // UI intensive settings
  private theme?: string;

  // app settings
  private pwaStatus?: PWAStatus;

  constructor(
    private title: Title,
    private meta: Meta,
    private localstorageService: LocalstorageService,
  ) {}

  init(
    options: AppOptions = {},
    defaultMetas: AppMetas = {}
  ) {
    this.options = options;
    this.defaultMetas = defaultMetas;
    // mark app loaded ok (prevent timeout - unsupported message)
    if (this.options.splashScreen) {
      this.getSplashScreenElement().classList.add('has-app');
    }
    // set app host
    this.setHost();
    // set viewport
    window.addEventListener('resize', () => this.setViewport());
    this.setViewport();

    // =======================================================
    // NOTE: Settings flow
    // + Get: Remote (auth user) -> Local storage (if enabled) -> AppService -> Apply
    // + Set: Apply -> AppService -> Local storage (if enabled) -> Remote (maybe?)
    // =======================================================

    const {
      settingsLoaderUI = () => of({}),
      settingsLoader = () => of({}),
    } = this.options;

    // handle UI intensive settings
    settingsLoaderUI()
    .pipe(
      mergeMap(uiSettings => this.localUISettingsLoader(uiSettings)),
      mergeMap(uiSettings => this.appUISettingsLoader(uiSettings)),
    )
    .subscribe(uiSettings => {
      const {theme} = uiSettings;
      // change theme
      if (theme) {
        this.changeTheme(theme);
      }
      // hide splash screen
      if (this.options.splashScreen) {
        this.hideSplashScreen();
      }
    });

    // handle other settings
    settingsLoader()
    .pipe(
      mergeMap(settings => this.localSettingsLoader(settings)),
      mergeMap(settings => this.appSettingsLoader(settings)),
    )
    .subscribe(settings => {
      const {pwaStatus} = settings;
      // change PWA status
      if (pwaStatus) {
        this.changePWAStatus(pwaStatus);
      }
    });
  }

  get OPTIONS() {
    return this.options;
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

  get THEME() {
    return this.theme;
  }

  get IS_PWA_INSTALLED() {
    return !!(this.options.pwa && this.pwaStatus === 'installed');
  }

  get IS_PWA_AVAILABLE() {
    return !!(this.options.pwa && this.pwaStatus === 'available');
  }

  getData<Value>(key: string) {
    return (this.options.customData || {})[key] as Value;
  }

  addData(data: Record<string, unknown>) {
    this.options.customData = {...data, ...(this.options.customData || {})};
    return this as AppService;
  }

  changeHTMLLang(code = 'en') {
    document.documentElement.setAttribute('lang', code);
    return this as AppService;
  }
  
  changePageTitle(title: string) {
    this.title.setTitle(title);
    return this as AppService;
  }

  changePageMetas(customMetas: AppCustomMetas) {
    const metas = this.processMetaData(customMetas);
    // set title and meta tags
    this.changePageTitle(metas.title || 'App');
    this.changeMetaTags(metas);
    return this as AppService;
  }

  shareApp() {
    const {title, description: text, url} = this.defaultMetas;
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

  changeTheme(name: string) {
    // handler
    document.body.setAttribute('data-theme', name);
    // in app
    this.theme = name;
    // local
    if (this.options.localSettings) {
      this.localstorageService.set(this.LSK_THEME, name);
    }
    // remote
    // ...
  }

  changePWAStatus(status: PWAStatus) {
    // handler
    if (status === 'available') {
      this.showPWAReminder();
    }
    // in app
    this.pwaStatus = status;
    // local
    if (this.options.localSettings) {
      // if available
      if (status === 'available') {
        this.localstorageService.set(this.LSK_PWA_REMINDER_TIMESTAMP, new Date().getTime());
        this.localstorageService.increase(this.LSK_PWA_REMINDER_COUNT);
      }
      // if installed
      if (status === 'installed') {
        this.localstorageService.set(this.LSK_PWA_STATUS, status);
      }
    }
    // remote
    // if (status === 'installed') {}
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

  showPWAReminder() {
    const elm = this.getPWAReminderElement();
    // get ua
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      if (
        !(/crios/).test(userAgent) &&
        !(/fxios/).test(userAgent) &&
        !(/opios/).test(userAgent)
      ) {
        elm.classList.add('ios-safari', 'show');
      } else {
        elm.classList.add('ios-any', 'show');
      }
    } else if (/windows|macintosh/.test(userAgent)) {
      if (/chrome/.test(userAgent)) {
        elm.classList.add('desktop-chrome', 'show');
      } else {
        elm.classList.add('desktop-any', 'show');
      }
    }
    // close button
    const close = elm.querySelector('.close');
    if (close) {
      close.addEventListener('click', () => this.hidePWAReminder(), {once: true});
    }
    // dismissal
    const dismiss = elm.querySelector('.dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', () => {
        this.hidePWAReminder();
        this.dismissPWAReminder();
      }, {once: true});
    }
  }

  hidePWAReminder() {
    const elm = this.getPWAReminderElement();
    elm.classList.remove('show');
  }

  dismissPWAReminder() {
    this.changePWAStatus('installed');
  }

  private getSplashScreenElement() {
    const elm = document.getElementById('app-splash-screen');
    if (!this.options.splashScreen || !elm) {
      throw new Error('No #app-splash-screen');
    }
    return elm;
  }

  private getPWAReminderElement() {
    const elm = document.getElementById('pwa-install-reminder');
    if (!this.options.pwaReminder || !elm) {
      throw new Error('No #pwa-install-reminder');
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

  private localUISettingsLoader(uiSettings: BuiltinUISettings) {
    return of(uiSettings).pipe(
      // .theme
      mergeMap(({ theme }) =>
        // pass value down
        theme
          ? of(theme)
          // get from local
          : this.options.localSettings
            ? this.localstorageService.get<string>(this.LSK_THEME)
            // no local option
            : of(null)
      ),
      mergeMap(theme =>
        of({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }
  
  private appUISettingsLoader(uiSettings: BuiltinUISettings) {
    return of(uiSettings).pipe(
      // .theme
      mergeMap(({ theme }) =>
        of(
          // pass down
          theme
            ? theme
            // default theme
            : !this.options.browserColor
              ? null
              // browser scheme colors
              : (
                window.matchMedia
                && window.matchMedia('(prefers-color-scheme: dark)').matches
              )
                ? 'dark'
                : 'light'
        )
      ),
      mergeMap(theme =>
        of({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }

  private localSettingsLoader(settings: BuiltinSettings) {
    return of(settings).pipe(
      // .pwaStatus
      mergeMap(({ pwaStatus }) =>
        // pass down remote (implicit installed only)
        pwaStatus && pwaStatus === 'installed'
          ? of(pwaStatus)
          // no local settings
          : !this.options.localSettings
            ? of(undefined)
              // local storage
              : this.localstorageService.get<string>(this.LSK_PWA_STATUS)
      ),
      mergeMap(pwaStatus =>
        // pass down local (installed & unavailable)
        pwaStatus && pwaStatus !== 'available'
          ? of(pwaStatus)
          // no local settings (undefined || available)
          : !this.options.localSettings
            ? of(undefined)
            // by local metric
            : this.getPWAStatusByLocalMetrics()
      ),
      mergeMap(pwaStatus =>
        of({...settings, pwaStatus} as BuiltinSettings)
      ),
      // other settings
      // mergeMap(settings => {})
    );
  }

  private appSettingsLoader(settings: BuiltinSettings) {
    return of(settings).pipe(
      // .pwaStatus
      mergeMap(({ pwaStatus }) =>
        of(pwaStatus || 'unavailable')
      ),
      mergeMap(pwaStatus =>
        of({...settings, pwaStatus} as BuiltinSettings)
      ),
      // other settings
      // mergeMap(settings => {})
    );
  }

  private getPWAStatusByLocalMetrics() {
    return this.localstorageService.getBulk([
      this.LSK_PWA_REMINDER_TIMESTAMP,
      this.LSK_PWA_REMINDER_COUNT
    ])
    .pipe(
      mergeMap(([timestamp = 0, count = 0]) => {
        const {pwaReminder, pwaReminderEvery, pwaReminderMax} = this.options;
        // is standalone
        const isInstalled = 
          (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        // is available (for reminder)
        const isAvailable =
          // must have the reminder
          pwaReminder
          // must not pass the maximum (if defined)
          && (!pwaReminderMax || (count as number) < pwaReminderMax)
          // must expired
          && (
            (pwaReminderEvery ? (pwaReminderEvery * 60000) : 43200000 /* 12 hours */)
            < (new Date().getTime() - new Date(timestamp as number).getTime())
          );
        return of(
          isInstalled ? 'installed' : isAvailable ? 'available' : 'unavailable'
        );
      })
    );
  }

  private processMetaData(customMetas: AppCustomMetas) {
    // custom
    const title = customMetas['title'] || this.defaultMetas['title'];
    const description = customMetas['description'] || this.defaultMetas['description'];
    const image = customMetas['image'] || this.defaultMetas['image'];
    const url = customMetas['url'];
    const author = customMetas['author'] || this.defaultMetas['author'];
    const twitterCard = customMetas['twitterCard'] || this.defaultMetas['twitterCard'];
    const twitterCreator = customMetas['twitterCreator'] || this.defaultMetas['twitterCreator'];
    const ogType = customMetas['ogType'] || this.defaultMetas['ogType'];
    const ogLocale = customMetas['ogLocale'] || this.defaultMetas['ogLocale'];
    // default
    const twitterSite = this.defaultMetas['twitterSite'];
    const ogSiteName = this.defaultMetas['ogSiteName'];
    const fbAppId = this.defaultMetas['fbAppId'];
    return {
      title,
      description,
      image,
      url,
      author,
      twitterCard,
      twitterSite,
      twitterCreator,
      ogType,
      ogSiteName,
      ogLocale,
      fbAppId,
    } as AppMetas;
  }

  private changeHTMLLinkTags(items: Array<{ rel: string, href: string }>) {
    const dom = window.document;
    for (const item of items) {
      const { rel, href } = item;
      let elem = dom.querySelector(`link[rel=${rel}]`);
      if (!elem) {
        // create
        elem = dom.createElement('link');
        elem.setAttribute('rel', rel);
        dom.head.appendChild(elem);
        elem.setAttribute('href', href);
      } else {
        // update
        elem.setAttribute('href', href);
      }
    }
  }

  private changeMetaTags(metas: AppMetas) {
    const {
      title, description, image, url, author,
      twitterCard, twitterSite, twitterCreator,
      ogType, ogSiteName, ogLocale, fbAppId,
    } = metas;
    // update links and meta
    if (title) {
      this.meta.removeTag('itemprop="name"');
      this.meta.updateTag({ itemprop: 'name', content: title });
      this.meta.updateTag({ property: 'og:title', content: title });
    }
    if (description) {
      this.meta.removeTag('itemprop="description"');
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ itemprop: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    if (image) {
      this.meta.removeTag('itemprop="image"');
      this.meta.updateTag({ itemprop: 'image', content: image });
      this.meta.updateTag({ property: 'og:image', content: image });
    }
    if (url) {
      this.meta.updateTag({ property: 'og:url', content: url });
      this.changeHTMLLinkTags([{ rel: 'canonical', href: url }]);
    }
    if (author) {
      this.changeHTMLLinkTags([{ rel: 'author', href: author }]);
    }
    if (twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    }
    if (twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: twitterSite });
    }
    if (twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: twitterCreator });
    }
    if (ogType) {
      this.meta.updateTag({ property: 'og:type', content: ogType });
    }
    if (ogSiteName) {
      this.meta.updateTag({ property: 'og:site_name', content: ogSiteName });
    }
    if (ogLocale) {
      this.meta.updateTag({ property: 'og:locale', content: ogLocale });
    }
    if (fbAppId) {
      this.meta.updateTag({ property: 'fb:app_id', content: fbAppId });
    }
  }
}

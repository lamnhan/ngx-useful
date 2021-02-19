import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HelperService } from '../helper/helper.service';
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
  customData?: Record<string, unknown>;
  /**
   * Support local settings
   */
  local?: boolean;
  /**
   * If your app has in-app splash screen
   */
  splashScreen?: boolean;
  /**
   * Set theme based on browser color schema
   */
  browserTheme?: boolean;
  /**
   * Anable PWA supports
   */
  pwa?: boolean;
  pwaReminder?: boolean | number;
  pwaReminderThreshold?: number;
}

export type PWAStatus =
  | 'installed' // standalone or implicit installed
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
  private readonly ___PWA_INSTALL_REMINDER_TIMESTAMP = 'pwa_install_reminder_timestamp';
  private readonly ___PWA_INSTALL_REMINDER_COUNT = 'pwa_install_reminder_count';

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
    private helperService: HelperService,
    private localstorageService: LocalstorageService,
  ) {}

  init(
    options: AppOptions = {},
    defaultMetas: AppMetas = {},
    customSettingsLoader?: () => Observable<BuiltinSettings>,
    customUISettingsLoader?: () => Observable<BuiltinUISettings>,
  ) {
    this.options = {
      browserTheme: true,
      ...options
    };
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
    // + Load: Remote (auth user) -> Local (if enabled) -> App default -> Handler
    // + Update: Handler -> App -> Local (if enabled) -> Remote (TO DO)
    // =======================================================

    // handle UI intensive settings
    if (!customUISettingsLoader) {
      customUISettingsLoader = (): any => this.helperService.observableResponder({});
    }
    customUISettingsLoader()
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
    if (!customSettingsLoader) {
      customSettingsLoader = (): any => this.helperService.observableResponder({});
    }
    customSettingsLoader()
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
    return this.pwaStatus === 'installed';
  }

  get IS_PWA_AVAILABLE() {
    return this.pwaStatus === 'available';
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
  
  changeTheme(name: string) {
    // handler
    document.body.setAttribute('data-theme', name);
    // in app
    this.theme = name;
    // local
    if (this.options.local) {
      this.localstorageService.set('theme', name);
    }
    // TODO: remote
  }

  changePWAStatus(status: PWAStatus) {
    // handler
    if (status === 'available') {
      this.showPWAReminder();
      if (this.options.local) {
        this.localstorageService
          .set(this.___PWA_INSTALL_REMINDER_TIMESTAMP, new Date().getTime());
        this.localstorageService
          .increase(this.___PWA_INSTALL_REMINDER_COUNT);
      }
    }
    if (status === 'installed') {
      this.localstorageService
        .set(this.___PWA_INSTALL_REMINDER_TIMESTAMP, -1);
    }
    // in app
    this.pwaStatus = status;
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
    return this.helperService.observableResponder(uiSettings)
    .pipe(
      // .theme
      mergeMap(({ theme }) =>
        // pass value down
        theme
          ? this.helperService.observableResponder(theme)
          // get from local
          : this.options.local
            ? this.localstorageService.get<string>('theme')
            // no local option
            : this.helperService.observableResponder(null)
      ),
      mergeMap(theme =>
        this.helperService.observableResponder({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }
  
  private appUISettingsLoader(uiSettings: BuiltinUISettings) {
    return this.helperService.observableResponder(uiSettings)
    .pipe(
      // .theme
      mergeMap(uiSettings =>
        this.helperService.observableResponder(
          // pass down
          uiSettings.theme
          ? uiSettings.theme
          // default theme
          : !this.options.browserTheme
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
        this.helperService.observableResponder({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }

  private localSettingsLoader(settings: BuiltinSettings) {
    return this.helperService.observableResponder(settings)
    .pipe(
      // .pwaStatus
      mergeMap(({ pwaStatus }) =>
        !this.options.pwa || !this.options.local
          ? this.helperService.observableResponder('unavailable')
          // pass down (implicit installed)
          : pwaStatus
            ? this.helperService.observableResponder(pwaStatus)
            // by local metric
            : this.getPWAStatusByLocalMetrics()
      ),
      mergeMap(pwaStatus =>
        this.helperService.observableResponder({...settings, pwaStatus} as BuiltinSettings)
      ),
      // other settings
      // mergeMap(settings => {})
    );
  }

  private appSettingsLoader(settings: BuiltinSettings) {
    return this.helperService.observableResponder(settings)
    .pipe(
      // .pwaStatus
      mergeMap(settings =>
        this.helperService.observableResponder(settings)
      ),
      // other settings
      // mergeMap(settings => {})
    );
  }

  private getPWAStatusByLocalMetrics() {
    return this.localstorageService.getBulk([
      this.___PWA_INSTALL_REMINDER_TIMESTAMP,
      this.___PWA_INSTALL_REMINDER_COUNT
    ])
    .pipe(
      mergeMap(([timestamp = 0, count = 0]) => {
        const isInstalled = 
          // user click dismiss
          (timestamp && +(timestamp as string | number) === -1)
          // standalone
          || (navigator as any).standalone
          || window.matchMedia('(display-mode: standalone)').matches;
        const isAvailable =
          this.options.pwaReminder
          // must not pass the threshold
          && (
            (count as number) < (this.options.pwaReminderThreshold || 3) // default: 3 times
          )
          // must expired
          && (
            (
              this.options.pwaReminder === true
                ? 43200000 // default: 12 hours
                : (this.options.pwaReminder * 60000)
            ) < (
              new Date().getTime()
              - new Date(timestamp as number).getTime()
            )
          );
        return this.helperService.observableResponder(
          isInstalled
            ? 'installed'
            : isAvailable
              ? 'available'
              : 'unavailable'
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

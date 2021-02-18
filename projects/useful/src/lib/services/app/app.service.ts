import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
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
  splashScreen?: boolean;
  splashScreenManually?: boolean;
  localTheme?: boolean;
  browserTheme?: boolean;
  viewSizing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private options: AppOptions = {};
  private data: {[key: string]: unknown} = {};
  private defaultMetas: AppMetas = {};

  // splash screen
  private loading = true;

  // commonly data
  private viewWidth = 0;
  private viewHeight = 0;
  private host = '';
  private theme = 'default';

  constructor(
    private title: Title,
    private meta: Meta,
    private helperService: HelperService,
    private localstorageService: LocalstorageService,
  ) {}

  init(
    options: AppOptions = {},
    customData: Record<string, unknown> = {},
    defaultMetas: AppMetas = {},
  ) {
    this.options = {
      browserTheme: true,
      viewSizing: true,
      ...options
    };
    this.data = customData;
    this.defaultMetas = defaultMetas;
    // host
    this.setHost();
    // view port
    window.addEventListener('resize', () => this.setViewport());
    this.setViewport();
    // handle loading
    this.helperService
      .observableResponder(true)
      .pipe(
        // TODO: support loading waiters
        // local theme
        mergeMap(() =>
          this.options.localTheme
            ? this.localstorageService.get('theme')
            : this.helperService.observableResponder(null)
        ),
        // browser dark mode
        mergeMap(localTheme =>
          localTheme
            ? this.helperService.observableResponder(localTheme)
            : !this.options.browserTheme
            ? this.helperService.observableResponder(null)
            : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
            ? this.helperService.observableResponder('dark')
            : this.helperService.observableResponder('light')
        )
      )
      .subscribe(theme => {
        // set theme
        if (theme) {
          this.changeTheme(theme as string, false);
        }
        // update loading
        this.loading = false;
        if (this.options.splashScreen) {
          this.hideSplashScreen();
        }
      });
  }

  get OPTIONS() {
    return this.options;
  }

  get DATA() {
    return this.data;
  }

  get VIEW_WIDTH() {
    return this.viewWidth;
  }

  get VIEW_HEIGHT() {
    return this.viewHeight;
  }

  get HOST() {
    return this.host;
  }

  get THEME() {
    return this.theme;
  }

  get IS_LOADING() {
    return this.loading;
  }

  changeTheme(name = 'default', withLocalstorage = true) {
    if (withLocalstorage && this.options.localTheme) {
      this.localstorageService.set('theme', name);
    }
    this.theme = name;
    return document.body.setAttribute('data-theme', this.theme);
  }

  changeHTMLLang(code = 'en') {
    return document.documentElement.setAttribute('lang', code);
  }
  
  changePageTitle(title: string) {
    return this.title.setTitle(title);
  }

  changePageMetas(customMetas: AppCustomMetas) {
    const metas = this.processMetaData(customMetas);
    // set title and meta tags
    this.changePageTitle(metas.title || 'App');
    this.changeMetaTags(metas);
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

  getSplashScreenElement() {
    const elm = document.getElementById('app-splash-screen');
    if (!elm) {
      throw new Error('No #app-splash-screen');
    }
    return elm;
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

  private setViewport() {
    this.viewWidth = window.innerWidth;
    this.viewHeight = window.innerHeight;
    if (this.options.viewSizing) {
      document.documentElement.style
        .setProperty('--app-view-width', `${this.viewWidth}px`);
      document.documentElement.style
        .setProperty('--app-view-height', `${this.viewHeight}px`);
    }
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

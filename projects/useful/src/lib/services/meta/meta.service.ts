import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { SettingService } from '../setting/setting.service';

export interface AppCustomMetas {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  lang?: string;
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

export interface MetaTranslations {
  [locale: string]: AppMetas;
}

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private defaultMetas: AppMetas = {};
  private metaTranslations: MetaTranslations = {};

  constructor(
    private title: Title,
    private meta: Meta,
    private settingService: SettingService,
  ) {}

  init(
    defaultMetas: AppMetas = {},
    metaTranslations: MetaTranslations = {},
  ) {
    this.defaultMetas = defaultMetas;
    this.metaTranslations = metaTranslations;
    // watch for locale changed
    this.settingService.onLocaleChanged.subscribe(locale => this.changePageMetas({}, locale));
    // done
    return this as MetaService;
  }

  get TITLE() {
    return this.getAppMetas().title;
  }

  get DESCRIPTION() {
    return this.getAppMetas().description;
  }

  get URL() {
    return this.getAppMetas().url;
  }

  get IMAGE() {
    return this.getAppMetas().image;
  }

  get AUTHOR() {
    return this.getAppMetas().author;
  }

  get LANG() {
    return this.getAppMetas().lang;
  }

  changePageTitle(title: string) {
    this.title.setTitle(title);
    return this as MetaService;
  }

  changePageLang(code: string) {
    document.documentElement.setAttribute('lang', code);
    return this as MetaService;
  }

  changePageMetas(customMetas: AppCustomMetas = {}, withLocale?: string) {
    const metas = this.processMetaData(customMetas, withLocale);
    this.changePageTitle(metas.title || 'App');
    this.changePageLang(metas.lang || 'en');
    this.changeMetaTags(metas);
    return this as MetaService;
  }

  private getAppMetas(withLocale?: string) {
    const locale = withLocale || this.settingService.LOCALE;
    return this.metaTranslations[locale] || this.defaultMetas;
  }

  private processMetaData(customMetas: AppCustomMetas, withLocale?: string) {
    const appMetas = this.getAppMetas(withLocale);
    // custom
    const title = customMetas['title'] || appMetas['title'];
    const description = customMetas['description'] || appMetas['description'];
    const image = customMetas['image'] || appMetas['image'];
    const url = customMetas['url'];
    const author = customMetas['author'] || appMetas['author'];
    const lang = customMetas['lang'] || appMetas['lang'];
    const twitterCard = customMetas['twitterCard'] || appMetas['twitterCard'];
    const twitterCreator = customMetas['twitterCreator'] || appMetas['twitterCreator'];
    const ogType = customMetas['ogType'] || appMetas['ogType'];
    const ogLocale = customMetas['ogLocale'] || appMetas['ogLocale'];
    // default
    const twitterSite = appMetas['twitterSite'];
    const ogSiteName = appMetas['ogSiteName'];
    const fbAppId = appMetas['fbAppId'];
    return {
      title,
      description,
      image,
      url,
      author,
      lang,
      twitterCard,
      twitterSite,
      twitterCreator,
      ogType,
      ogSiteName,
      ogLocale,
      fbAppId,
    } as AppMetas;
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
}

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
    this.settingService
      .onLocaleChanged
      .subscribe(locale => {
        console.log('Update meta: ', locale);
      });
  }

  get TITLE() {
    return this.defaultMetas.title;
  }

  get DESCRIPTION() {
    return this.defaultMetas.description;
  }

  get URL() {
    return this.defaultMetas.url;
  }

  get IMAGE() {
    return this.defaultMetas.image;
  }

  get AUTHOR() {
    return this.defaultMetas.author;
  }

  get LANG() {
    return this.defaultMetas.lang;
  }

  changePageTitle(title: string) {
    this.title.setTitle(title);
    return this as MetaService;
  }

  changePageLang(code: string) {
    document.documentElement.setAttribute('lang', code);
    return this as MetaService;
  }

  changePageMetas(customMetas: AppCustomMetas) {
    const metas = this.processMetaData(customMetas);
    this.changePageTitle(metas.title || 'App');
    this.changePageLang(metas.lang || 'en');
    this.changeMetaTags(metas);
    return this as MetaService;
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

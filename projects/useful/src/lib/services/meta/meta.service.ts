import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { SettingService } from '../setting/setting.service';

export interface MetaOptions {}

export interface MetaIntegrations {
  settingService?: SettingService;
}

export interface AppCustomMetas {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  locale?: string;
  lang?: string;
  authorName?: string;
  authorUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  ogType?: string;
  twitterCard?: string;
  twitterCreator?: string;
}

export interface AppMetas extends AppCustomMetas {
  ogSiteName?: string;
  fbAppId?: string;
  twitterSite?: string;
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
  private options: MetaOptions = {};
  private integrations: MetaIntegrations = {};

  appMetas: AppMetas = {};

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  init(
    defaultMetas: AppMetas,
    options: MetaOptions = {},
    integrations: MetaIntegrations = {},
    metaTranslations: MetaTranslations = {},
  ) {
    this.defaultMetas = defaultMetas;
    this.metaTranslations = metaTranslations;
    this.options = options;
    this.integrations = integrations;
    this.appMetas = this.defaultMetas;
    // watch for locale changed
    if (this.integrations.settingService) {
      this.integrations.settingService
        .onLocaleChanged
        .subscribe(locale => this.appMetas = this.getAppMetas(locale));
    }
    // done
    return this as MetaService;
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
    const locale = withLocale
      || this.integrations?.settingService?.locale
      || 'en-US';
    return this.metaTranslations[locale] || this.defaultMetas;
  }

  private processMetaData(customMetas: AppCustomMetas, withLocale?: string) {
    const appMetas = this.getAppMetas(withLocale);
    // custom
    const url = customMetas['url'] || location.href;
    const title = customMetas['title'] || appMetas['title'];
    const description = customMetas['description'] || appMetas['description'];
    const image = customMetas['image'] || appMetas['image'];
    const locale = customMetas['locale'] || appMetas['locale'];
    const lang = customMetas['lang'] ||
      (!locale ? '' : locale.split('-').shift() as string) ||
      appMetas['lang'];
    const authorName = customMetas['authorName'] || appMetas['authorName'];
    const authorUrl = customMetas['authorUrl'] || appMetas['authorUrl'];
    const createdAt = customMetas['createdAt'] || appMetas['createdAt'];
    const updatedAt = customMetas['updatedAt'] || appMetas['updatedAt'];
    const ogType = customMetas['ogType'] || appMetas['ogType'];
    const twitterCard = customMetas['twitterCard'] || appMetas['twitterCard'];
    const twitterCreator = customMetas['twitterCreator'] || appMetas['twitterCreator'];
    // default (from index.html)
    const ogSiteName = appMetas['ogSiteName'];
    const fbAppId = appMetas['fbAppId'];
    const twitterSite = appMetas['twitterSite'];
    return {
      url,
      title,
      description,
      image,
      locale,
      lang,
      authorName,
      authorUrl,
      createdAt,
      updatedAt,
      ogType,
      ogSiteName,
      fbAppId,
      twitterCard,
      twitterCreator,
      twitterSite,
    } as AppMetas;
  }

  private changeMetaTags(metas: AppMetas) {
    const {
      url, title, description, image, locale,
      authorName, authorUrl, createdAt, updatedAt,
      ogType, ogSiteName,  fbAppId,
      twitterCard, twitterCreator, twitterSite,
    } = metas;
    // update links and meta    
    if (url) {
      this.meta.removeTag('itemprop="url"');
      this.changeHTMLLinkTags([{ rel: 'canonical', href: url }]);
      this.meta.updateTag({ itemprop: 'url', content: url });
      this.meta.updateTag({ property: 'og:url', content: url });
    }
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
    if (locale) {
      this.meta.removeTag('itemprop="inLanguage"');
      this.meta.updateTag({ itemprop: 'inLanguage', content: locale });
      this.meta.updateTag({ property: 'og:locale', content: locale });
    }
    if (authorName) {
      this.meta.removeTag('itemprop="author"');
      this.meta.updateTag({ itemprop: 'author', content: authorName });
    }
    if (authorUrl) {
      this.changeHTMLLinkTags([{ rel: 'author', href: authorUrl }]);
    }
    if (createdAt) {
      this.meta.removeTag('itemprop="dateCreated"');
      this.meta.removeTag('itemprop="datePublished"');
      this.meta.updateTag({ itemprop: 'dateCreated', content: createdAt });
      this.meta.updateTag({ itemprop: 'datePublished', content: createdAt });
    }
    if (updatedAt) {
      this.meta.removeTag('itemprop="dateModified"');
      this.meta.updateTag({ itemprop: 'dateModified', content: updatedAt });
    }
    if (ogType) {
      this.meta.updateTag({ property: 'og:type', content: ogType });
    }
    if (ogSiteName) {
      this.meta.updateTag({ property: 'og:site_name', content: ogSiteName });
    }
    if (fbAppId) {
      this.meta.updateTag({ property: 'fb:app_id', content: fbAppId });
    }
    if (twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    }
    if (twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: twitterCreator });
    }    
    if (twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: twitterSite });
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

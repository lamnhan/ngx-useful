import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

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

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private data: {[key: string]: unknown} = {};
  private defaultMetas: AppMetas = {};

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  init(
    data: Record<string, unknown> = {},
    defaultMetas: AppMetas = {},
  ) {
    this.data = { ...this.data, ...data };
    this.defaultMetas = defaultMetas;
    // built-in data
    this.setViewPortAuto();
    this.setHostAuto();
  }

  getData() {
    return this.data;
  }

  getViewWidth() {
    return (this.data.viewWidth || 0) as number;
  }

  getViewHeight() {
    return (this.data.viewHeight || 0) as number;
  }

  getHost() {
    return (this.data.host || '') as string;
  }

  getTheme() {
    return (this.data.theme || 'default') as string;
  }

  changeLang(code = 'en') {
    return document.documentElement.setAttribute('lang', code);
  }

  changeTheme(name?: string) {
    this.data.theme = name;
    return name
      ? document.body.setAttribute('data-theme', name)
      : document.body.removeAttribute('data-theme');
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
  
  private setViewPortAuto() {
    const setViewportHandler = () => {
      this.data.viewWidth = window.innerWidth;
      this.data.viewHeight = window.innerHeight;
    };
    window.addEventListener('resize', setViewportHandler);
    setViewportHandler();
  }

  private setHostAuto() {
    const baseHref = ((document.getElementsByTagName('base')[0] || {})['href'] || '').slice(0, -1);
    if (baseHref) {
      this.data.host = baseHref;
    } else {
      const hrefSplit = window.location.href.split('/').filter(Boolean);
      this.data.host = hrefSplit[0] + '//' + hrefSplit[1];
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

import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import {
  Router,
  Event,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd
} from '@angular/router';

export type RouterEvents = 'RouteConfigLoadStart' | 'RouteConfigLoadEnd' | 'NavigationEnd';

export interface CustomMetas {
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

export interface Metas extends CustomMetas {
  twitterSite?: string;
  ogSiteName?: string;
  fbAppId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavService {
  private router?: Router;
  private data: Record<string, unknown> = {};
  
  private loading = false;
  private previousUrls: string[] = [];

  private defaultMetas: Metas = {};
  private routeMetas: {[url: string]: Metas} = {};

  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  getRouter() {
    if (!this.router) {
      throw new Error('No router, please set first!');
    }
    return this.router;
  }

  setRouter(
    router: Router,
    hooks: {
      [key in RouterEvents]?: (event: Event) => void;
    } = {},
  ) {
    // set router
    this.router = router;
    // events
    this.router
      .events
      .subscribe(async event => {
      let eventName = '' as RouterEvents; // event name
      if (event instanceof RouteConfigLoadStart) {
        eventName = 'RouteConfigLoadStart';
        this.loading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        eventName = 'RouteConfigLoadEnd';
        setTimeout(() => { this.loading = false; }, 1000);
      } else if (event instanceof NavigationEnd) {
        eventName = 'NavigationEnd';
        // record urls for backing navigation
        const url = event.urlAfterRedirects;
        const backUrl = this.previousUrls[this.previousUrls.length - 2];
        if (!backUrl || (!!backUrl && url !== backUrl)) {
          this.previousUrls.push(url);
        } else {
          this.previousUrls.pop();
        }
        // set title & meta
        this.setMeta(
          (this.routeMetas[(this.router as Router).url] as Record<string, unknown>)
          || {}
        );
      }
      // run hook
      const hook = hooks[eventName] || ((e: Event) => e);
      hook(event);
    });
    return this as NavService;
  }

  setDefaultMetas(metas: Metas) {
    this.defaultMetas = metas;
    return this as NavService;
  }

  /**
   * data
   */
  get(key?: string) {
    return !!key ? this.data[key] : this.data;
  }

  /**
   * helpers
   */
  isLoading() {
    return this.loading;
  }

  canGoBack() {
    return this.router
      && this.previousUrls.length > 1
      && this.router.url !== ''
      && this.router.url !== '/';
  }

  /**
   * navigation
   */
  back() {
    const [ path, ... queryStringArr ] = (this.previousUrls[this.previousUrls.length - 2] || '/').split('?');
    // query params
    const queryParams = {} as Record<string, unknown>;
    if (!!queryStringArr.length) {
      const queryItems = queryStringArr.join('?').split('&');
      for (const queryItem of queryItems) {
        const [ key, value ] = queryItem.split('=');
        if (!!key && !!value) {
          queryParams[key] = value;
        }
      }
    }
    // navigate
    return this.navigate([ path ], {}, { queryParams });
  }

  navigate(
    route: string[],
    data: {[key: string]: any} = {},
    navigationExtras: any = {},
  ) {
    this.data = data;
    return this.getRouter().navigate(route, navigationExtras);
  }

  scrollToTop() {
    const bodyElm = document.getElementsByTagName('body').item(0);
    return this.scrollTo(bodyElm as HTMLElement);
  }

  scrollTo(input: string | HTMLElement) {
    const elm = typeof input === 'string'
      ? document.getElementById(input)
      : input;
    return elm?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * meta
   */

  setMeta(
    data: Record<string, unknown> = {},
    rewriteFields: Record<string, unknown> = {}
  ) {
    // extract & process meta data
    const customMetas = this.extractMetaData(data, rewriteFields);
    const metas = this.processMetaData(customMetas);
    // save meta data
    if (this.router && !this.routeMetas[this.router.url]) {
      this.routeMetas[this.router.url] = customMetas;
    }
    // set title and meta tags
    this.setTitle(metas.title || 'App');
    this.setTags(metas);
  }

  private setTitle(newTitle: string) {
    return this.title.setTitle(newTitle);
  }

  private setTags(data: Metas) {
    const {
      title, description, image, url, author,
      twitterCard, twitterSite, twitterCreator,
      ogType, ogSiteName, ogLocale, fbAppId,
    } = data;
    // update links and meta
    if (!!title) {
      this.meta.removeTag('itemprop="name"');
      this.meta.updateTag({ itemprop: 'name', content: title });
      this.meta.updateTag({ property: 'og:title', content: title });
    }
    if (!!description) {
      this.meta.removeTag('itemprop="description"');
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ itemprop: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    if (!!image) {
      this.meta.removeTag('itemprop="image"');
      this.meta.updateTag({ itemprop: 'image', content: image });
      this.meta.updateTag({ property: 'og:image', content: image });
    }
    if (!!url) {
      this.meta.updateTag({ property: 'og:url', content: url });
      this.setLinks([{ rel: 'canonical', href: url }]);
    }
    if (!!author) {
      this.setLinks([{ rel: 'author', href: author }]);
    }
    if (!!twitterCard) {
      this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    }
    if (!!twitterSite) {
      this.meta.updateTag({ name: 'twitter:site', content: twitterSite });
    }
    if (!!twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: twitterCreator });
    }
    if (!!ogType) {
      this.meta.updateTag({ property: 'og:type', content: ogType });
    }
    if (!!ogSiteName) {
      this.meta.updateTag({ property: 'og:site_name', content: ogSiteName });
    }
    if (!!ogLocale) {
      this.meta.updateTag({ property: 'og:locale', content: ogLocale });
    }
    if (!!fbAppId) {
      this.meta.updateTag({ property: 'fb:app_id', content: fbAppId });
    }
  }

  private setLinks(items: Array<{ rel: string, href: string }>) {
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

  private extractMetaData(data: any, rewriteFields: any = {}): CustomMetas {
    const title = data[rewriteFields['title'] || 'title'];
    const description = data[rewriteFields['description'] || 'description'];
    const image = data[rewriteFields['image'] || 'image'];
    let url: string = data[rewriteFields['url'] || 'url'] || window.document.URL;
    url = url.substr(-1) === '/' ? url : (url + '/');
    const author = data[rewriteFields['author'] || 'author'];
    const twitterCard = data[rewriteFields['twitterCard'] || 'twitterCard'];
    const twitterCreator = data[rewriteFields['twitterCreator'] || 'twitterCreator'];
    const ogType = data[rewriteFields['ogType'] || 'ogType'];
    const ogLocale = data[rewriteFields['ogLocale'] || 'ogLocale'];
    return { title, description, image, url, author, twitterCard, twitterCreator, ogType, ogLocale };
  }

  private processMetaData(customMetas: CustomMetas): Metas {
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
      title, description, image, url, author,
      twitterCard, twitterSite, twitterCreator,
      ogType, ogSiteName, ogLocale, fbAppId,
    };
  }
}

import { Directive, HostBinding, HostListener, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { NavService } from '../../services/nav/nav.service';

interface ActiveOptions {
  exact?: boolean;
  also?: string[];
}

/**
 * Router link with more features
 */
@Directive({
  selector: 'a[usefulRouterLink]'
})
export class RouterLinkDirective implements OnInit, OnChanges, OnDestroy {
  private inputBuilder?: Observable<string | string[]>;
  private input: string | string[] = [];
  private backwardable?: boolean;
  private locale?: string;
  
  private activeClasses: string[] = [];
  private activeOptions: ActiveOptions = {};

  private title?: string;
  private data?: Record<string, unknown>;
  private extras?: NavigationExtras;

  @Input() set routeTitle(title: undefined | string) {
    this.title = title;
  }

  @Input() set routeData(data: undefined | Record<string, unknown>) {
    this.data = data;
  }

  @Input() set queryParams(queryParams: undefined | Record<string, unknown>) {
    if (queryParams) {
      this.extras = { ...this.extras, queryParams };
    }
  }

  @Input() set fragment(fragment: undefined | string) {
    if (fragment) {
      this.extras = { ...this.extras, fragment };
    }
  }

  @Input() set routeExtras(extras: undefined | NavigationExtras) {
    if (extras) {
      this.extras = { ...this.extras, ...extras };
    }
  }

  @Input() set usefulRouterLink(input: undefined | string | string[] | Observable<string | string[]>) {
    if (input && (input as any).subscribe) {
      this.inputBuilder = input as Observable<string | string[]>;
    } else {
      this.input = input as string | string[] || [];
    }
  }

  @Input() set routerBackwardable(backwardable: undefined | boolean) {
    this.backwardable = backwardable;
  }

  @Input() set routerLocale(locale: undefined | string) {
    this.locale = locale;
  }

  @Input() set usefulRouterLinkActive(classes: undefined | string | string[]) {
    this.activeClasses = !classes
      ? []
      : typeof classes === 'string'
        ? classes.split(' ').filter(value => !!value)
        : classes;
  }

  @Input() set routerLinkActiveOptions(options: undefined | ActiveOptions) {
    this.activeOptions = options || {};
  }

  @HostBinding() href!: string;

  @HostBinding() class!: string | string[];

  @HostListener('click') onClick() {
    this.navService.navigate(this.input, {
      title: this.title,
      data: this.data,
      extras: this.extras,
      backwardable: this.backwardable,
      locale: this.locale,
    });
    return false;
  }

  private refreshSubscription!: Subscription;
  private builderSubscription?: Subscription;

  constructor(private readonly navService: NavService) {}

  ngOnInit() {
    this.refreshSubscription = this.navService.onRefreshRouterLink
      .subscribe(() => this.updateTargetAttributes());
    if (this.inputBuilder) {
      this.builderSubscription = this.inputBuilder.subscribe(input => {
        this.input = input;
        this.updateTargetAttributes();
      });
    }
  }

  ngOnChanges() {
    this.updateTargetAttributes();
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
    if (this.builderSubscription) {
      this.builderSubscription.unsubscribe();
    }
  }

  private updateTargetAttributes() {
    // href
    this.href = this.navService.getRouteUrl(this.input, this.locale);
    // active
    const {exact, also} = this.activeOptions;
    let isActive = this.navService.isActive(this.href, !!exact);
    (also || []).forEach(item => {
      if (!this.navService.isRouteActive(item, !!exact, this.locale)) return;
      isActive = true;
    });
    this.class = isActive ? this.activeClasses : '';
  }
}

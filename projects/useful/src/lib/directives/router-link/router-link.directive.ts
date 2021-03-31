import { Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { NavService } from '../../services/nav/nav.service';

interface ActiveOptions {
  exact: boolean;
}

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[usefulRouterLink]'
})
export class RouterLinkDirective implements OnChanges, OnDestroy {
  private input: string | string[] = [];
  private backwardable?: boolean;
  private locale?: string;
  
  private activeClasses?: string[] = [];
  private activeOptions?: ActiveOptions;

  private title?: string;
  private data?: Record<string, unknown>;
  private extras?: NavigationExtras;

  @Input() set usefulRouteTitle(title: undefined | string) {
    this.title = title;
  }

  @Input() set usefulRouteData(data: undefined | Record<string, unknown>) {
    this.data = data;
  }

  @Input() set usefulRouteExtras(extras: undefined | NavigationExtras) {
    this.extras = extras;
  }

  @Input() set usefulRouterLink(input: undefined | null | string | string[]) {
    this.input = input || [];
  }

  @Input() set usefulRouterBackwardable(backwardable: undefined | boolean) {
    this.backwardable = backwardable;
  }

  @Input() set usefulRouterLocale(locale: undefined | string) {
    this.locale = locale;
  }

  @Input()
  set usefulRouterLinkActive(classes: undefined | string | string[]) {
    this.activeClasses = !classes
      ? []
      : typeof classes === 'string'
        ? classes.split(' ').filter(value => !!value)
        : classes;
  }

  @Input()
  set usefulRouterLinkActiveOptions(activeOptions: undefined | ActiveOptions) {
    this.activeOptions = activeOptions;
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

  private readonly refreshSubscription = this.navService
    .onRefreshRouterLink
    .subscribe(() => this.updateTargetAttributes());

  constructor(private readonly navService: NavService) {}

  ngOnChanges() {
    this.updateTargetAttributes();
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

  private updateTargetAttributes() {
    this.href = this.navService.getRouteUrl(this.input, this.locale);
    this.class =
      (
        this.activeClasses
        && this.navService.isActive(this.href, !!this.activeOptions?.exact)
      )
        ? this.activeClasses
        : [];
  }
}

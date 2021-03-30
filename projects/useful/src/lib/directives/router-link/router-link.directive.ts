import { Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { NavigationExtras } from '@angular/router';

import { NavService } from '../../services/nav/nav.service';

interface ActiveOptions {
  exact: boolean;
}

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[routerLink]'
})
export class RouterLinkDirective implements OnChanges, OnDestroy {
  private input: string | string[] = [];

  private title?: string;
  private data?: Record<string, unknown>;
  private backward?: boolean;
  private locale?: string;
  private extras?: NavigationExtras;

  private activeClasses?: string[] = [];
  private activeOptions?: ActiveOptions;

  @Input() set routerLink(input: undefined | null | string | string[]) {
    this.input = input || [];
  }

  @Input() set routeTitle(title: undefined | string) {
    this.title = title;
  }

  @Input() set routeData(data: undefined | Record<string, unknown>) {
    this.data = data;
  }

  @Input() set routeBackward(backward: undefined | boolean) {
    this.backward = backward;
  }

  @Input() set routeLocale(locale: undefined | string) {
    this.locale = locale;
  }

  @Input() set routerExtras(extras: undefined | NavigationExtras) {
    this.extras = extras;
  }

  @Input() set routerLinkActive(classes: undefined | string | string[]) {
    this.activeClasses = !classes
      ? []
      : typeof classes === 'string'
        ? classes.split(' ').filter(value => !!value)
        : classes;
  }

  @Input() set routerLinkActiveOptions(options: undefined | ActiveOptions) {
    this.activeOptions = options;
  }

  @HostBinding() href!: string;

  @HostBinding() class!: string | string[];

  @HostListener('click') onClick() {
    this.navService.navigate(this.input, {
      title: this.title,
      data: this.data,
      enableBackward: this.backward,
      withLocale: this.locale,
      extras: this.extras,
    });
    return false;
  }

  private refreshSubscription = this.navService
    .onRefreshRouterLink
    .subscribe(() => this.updateTargetAttributes());

  constructor(private navService: NavService) {}

  ngOnChanges() {
    this.updateTargetAttributes();
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

  private updateTargetAttributes() {
    this.href = this.navService.getRouteUrl(this.input, this.locale);
    this.class =
      (this.activeClasses && this.navService.isActive(this.href, !!this.activeOptions?.exact))
        ? this.activeClasses
        : [];
  }
}

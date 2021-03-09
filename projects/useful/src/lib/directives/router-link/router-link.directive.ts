import { Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationExtras } from '@angular/router';

import { NavService } from '../../services/nav/nav.service';

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[routerLink]'
})
export class RouterLinkDirective implements OnChanges, OnDestroy {
  private input: string | string[] = [];
  private data?: Record<string, unknown>;
  private locale?: string;
  private extras?: NavigationExtras;
  private activeClasses?: string[] = [];

  @Input() set routerLink(input: undefined | null | string | string[]) {
    this.input = input || [];
  }

  @Input() set routeData(data: undefined | Record<string, unknown>) {
    this.data = data;
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

  @HostBinding() href!: string;

  @HostBinding() class!: string | string[];

  @HostListener('click') onClick() {
    this.navService.navigate(this.input, this.extras, this.data, this.locale);
    return false;
  }

  private subscription: Subscription;

  constructor(private navService: NavService) {
    this.subscription = navService
      .onRefreshRouterLink
      .subscribe(() => this.updateTargetAttributes());
  }

  ngOnChanges() {
    this.updateTargetAttributes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateTargetAttributes() {
    this.href = this.navService.getRouteUrl(this.input, this.locale);
    this.class =
      (this.activeClasses && this.navService.isActive(this.href))
        ? this.activeClasses
        : [];
  }
}

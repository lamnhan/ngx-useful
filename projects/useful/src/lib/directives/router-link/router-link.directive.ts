import { Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavService } from '../../services/nav/nav.service';

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[usefulRouterLink]'
})
export class RouterLinkDirective implements OnChanges, OnDestroy {
  private input: string | string[] = '';
  private data?: Record<string, unknown>;
  private locale?: string;
  private extras?: NavigationExtras;
  private activeClasses?: string[] = [];

  private subscription: Subscription;

  @Input() set usefulRouterLink(input: undefined | null | string | string[]) {
    this.input = input || '';
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
      ? classes.split(' ').filter(x => !!x)
      : classes;
  }

  @HostBinding() href!: string;

  @HostBinding() class!: string[];

  @HostListener('click') onClick() {
    this.navService.navigate(this.input, this.extras, this.data, this.locale);
    return false;
  }

  constructor(
    private router: Router,
    private navService: NavService
  ) {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHostAttributes();
      }
    });
  }

  ngOnChanges() {
    this.updateHostAttributes();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private updateHostAttributes() {
    // href
    this.href = this.navService.getI18nRoute(this.input, this.locale, true) as string;
    // class (active)
    if (this.activeClasses && this.router.isActive(this.href, true)) {
      this.class = this.activeClasses;
    }
  }
}

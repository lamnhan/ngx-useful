import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { NavService } from '../../services/nav/nav.service';

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[routerLink]'
})
export class RouterLinkDirective {
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
      ? classes.split(' ').filter(x => !!x)
      : classes;
  }

  @HostBinding() get href() {
    return this.navService.getRouteStr(this.input, this.locale);
  }

  @HostBinding() get class() {
    return this.activeClasses && this.router.isActive(this.href, true)
      ? this.activeClasses
      : [];
  }

  @HostListener('click') onClick() {
    this.navService.navigate(this.input, this.extras, this.data, this.locale);
    return false;
  }

  constructor(
    private router: Router,
    private navService: NavService
  ) {}

}

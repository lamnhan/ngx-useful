import { Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavService } from '../../services/nav/nav.service';

// NOTE: see implementation
// https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts

@Directive({
  selector: 'a[usefulRouterLink]'
})
export class RouterLinkDirective implements OnChanges, OnDestroy {
  private input: string | string[] = '';
  private subscription: Subscription;

  @Input() set usefulRouterLink(input: undefined | null | string | string[]) {
    this.input = input || '';
  }

  @HostBinding() href!: string;

  @HostListener('click') onClick() {
    this.navService.navigate(this.input);
    return false;
  }

  constructor(
    private router: Router,
    private navService: NavService
  ) {
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHref();
      }
    });
  }

  ngOnChanges() {
    this.updateHref();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private get HREF() {
    return typeof this.input === 'string'
      ? this.input
      : this.input.join('/');
  }

  private updateHref() {
    this.href = this.HREF;
  }
}

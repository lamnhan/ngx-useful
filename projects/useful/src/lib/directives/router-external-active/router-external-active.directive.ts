import { Directive, HostBinding, Input, OnChanges, OnDestroy } from '@angular/core';

import { NavService } from '../../services/nav/nav.service';

type ActiveInput = [(string | string[])?, string?, string?, boolean?, string?];

@Directive({
  selector: '[usefulRouterExternalActive]'
})
export class RouterExternalActiveDirective implements OnChanges, OnDestroy {
  private input?: ActiveInput;

  @Input() set usefulRouterExternalActive(input: undefined | ActiveInput) {
    this.input = input;
  }

  @HostBinding() class!: string | string[];

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
    const [routerLink, activeClass, inactiveClass, exact, withLocale] = this.input || [];
    if (routerLink && activeClass) {
      const isActive = this.navService.isRouteActive(routerLink, !!exact, withLocale);
      // reset classes
      const newClass = (!this.class
        ? []
        : typeof this.class === 'string'
          ? this.class.split(' ')
          : [...this.class]
      ).filter(item => item !== activeClass && (!inactiveClass || item !== inactiveClass));
      // add active/inactive class
      const cls = (isActive ? activeClass : inactiveClass) || inactiveClass;
      if (cls) {
        newClass.push(cls);
      }
      // set value
      this.class = newClass;
    }
  }

}

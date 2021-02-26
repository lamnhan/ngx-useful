import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { NavService } from '../../services/nav/nav.service';

@Directive({
  selector: '[appRouterLink]'
})
export class RouterLinkDirective {
  @Input() appRouterLink: string | string[] = '/';

  constructor(
    private el: ElementRef,
    private navService: NavService
  ) {
    this.el.nativeElement.href = this.appRouterLink;
  }

  @HostListener('click') onClick() {
    this.navService.navigate(this.appRouterLink);
  }
}

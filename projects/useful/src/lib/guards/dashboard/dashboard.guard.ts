import { Injectable, NgZone } from '@angular/core';
import {
  Route,
  RouterStateSnapshot,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { GuardService } from '../../services/guard/guard.service';
import { NavService } from '../../services/nav/nav.service';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanLoad {
  constructor(
    private readonly ngZone: NgZone,
    private guardService: GuardService,
    private navService: NavService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handler(state.url);
  }

  canLoad(route: Route) {
    return this.handler(route.path);
  }

  private handler(url?: string) {
    if (this.userService.allowedLevel(2)) {
      return true;
    }
    // not passed url, redirect to login page
    this.authService.setRedirectUrl(url);
    this.ngZone.run(() => this.navService.navigate(this.guardService.dashboardHandler));
    return false;
  }
}

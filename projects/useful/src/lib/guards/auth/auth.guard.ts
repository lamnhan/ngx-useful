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

/**
 * Only allow authenticated user
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly ngZone: NgZone,
    private guardService: GuardService,
    private navService: NavService,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handler(state.url);
  }

  canLoad(route: Route) {
    return this.handler(route.path);
  }

  private handler(url?: string) {
    if (this.authService.authenticated) {
      return true;
    }
    // not passed url, redirect to login page
    this.authService.setRedirectUrl(url);
    this.ngZone.run(() => this.navService.navigate(this.guardService.authHandler));
    return false;
  }
}

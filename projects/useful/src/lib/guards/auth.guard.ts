import { Injectable, NgZone } from '@angular/core';
import {
  Route,
  RouterStateSnapshot,
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
} from '@angular/router';

import { NavService } from '../services/nav/nav.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly ngZone: NgZone,
    private navService: NavService,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handler(state.url);
  }

  canLoad(route: Route) {
    return this.handler(route.path || null);
  }

  private handler(url: null | string) {
    if (this.authService.authenticated) {
      return true;
    }
    // Store the attempted URL for redirecting
    this.authService.setRedirectUrl(url);
    this.ngZone.run(() => this.navService.navigate(['login']));
    return false;
  }
}

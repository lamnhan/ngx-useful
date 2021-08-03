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
import { NetworkService } from '../../services/network/network.service';

@Injectable({
  providedIn: 'root',
})
export class OnlineGuard implements CanActivate, CanLoad {
  constructor(
    private readonly ngZone: NgZone,
    private guardService: GuardService,
    private navService: NavService,
    private networkService: NetworkService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.handler(state.url);
  }

  canLoad(route: Route) {
    return this.handler(route.path);
  }

  private handler(url?: string) {
    if (this.networkService.isOnline) {
      return true;
    }
    this.ngZone.run(() => this.navService.navigate(this.guardService.onlineHandler));
    return false;
  }
}

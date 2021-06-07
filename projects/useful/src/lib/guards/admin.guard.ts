import { Injectable, NgZone } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';

import { NavService } from '../services/nav/nav.service';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
  constructor(
    private readonly ngZone: NgZone,
    private navService: NavService,
    private userService: UserService
  ) {}

  canActivate() {
    return this.handler();
  }

  canLoad() {
    return this.handler();
  }

  private handler() {
    if (this.userService.allowedLevel(2)) {
      return true;
    }
    this.ngZone.run(() => this.navService.navigate(['']));
    return false;
  }
}

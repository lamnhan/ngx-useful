import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import firebase from 'firebase/app';
import { AuthUser } from '@lamnhan/schemata';

import { AuthService } from '../auth/auth.service';

export type AuthNativeUser = firebase.User | AuthUser; // | SheetbaseUser

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private nativeUser: null | AuthNativeUser = null; // native (firebase/sheetbase) user object
  private user: null | AuthUser = null; // @lamnhan/schemata user

  public readonly onUserChanged = new ReplaySubject<null | AuthUser>(1);

  constructor(private authService: AuthService) {}
  
  init() {
    this.authService
      .onAuthStateChanged
      .subscribe(user => this.setUser(user));
  }

  get NATIVE_USER() {
    return this.nativeUser;
  }

  get USER() {
    return this.user;
  }

  private setUser(nativeUser: null | AuthNativeUser) {
    // raw user
    this.nativeUser = nativeUser;
    // auth user
    if (!nativeUser) {
      this.user = null;
    } else {
      this.user = nativeUser as unknown as AuthUser;
    }
    // emit user ready
    this.onUserChanged.next(this.user);
  }
}

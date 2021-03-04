import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { User, UserProperties } from '@lamnhan/schemata';

import { AuthService } from '../auth/auth.service';

export type AuthNativeUser = firebase.User; // | SheetbaseUser

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private nativeUser: null | AuthNativeUser = null;
  private data?: UserProperties;

  public readonly onUserChanged = new ReplaySubject<undefined | UserProperties>(1);

  constructor(private authService: AuthService) {}
  
  init(
    dataLoader?: (uid: string) => Observable<User>
  ) {
    this.authService
      .onAuthStateChanged
      .pipe(
        switchMap(user => combineLatest([
          of(user),
          (
            dataLoader
            && user
            && user.uid
            && this.authService.DRIVER === 'firebase'
          )
            ? dataLoader(user.uid)
            : of(undefined),
        ]))
      )
      .subscribe(([nativeUser, userDoc]) => this.setUser(nativeUser, userDoc));
    // done
    return this as UserService;
  }

  get NATIVE_USER() {
    return this.nativeUser;
  }

  get DATA() {
    return this.data;
  }

  private setUser(
    nativeUser: null | AuthNativeUser,
    userDoc?: User
  ) {
    // raw user
    this.nativeUser = nativeUser;
    // auth user
    if (!nativeUser) {
      this.data = undefined;
    } else if (this.authService.DRIVER === 'firebase') {
      // TODO: fix this
      this.data = {
        ...(userDoc || {}),
        ...nativeUser as any,
      };
    } else {
      this.data = nativeUser as any;
    }
    // emit user ready
    this.onUserChanged.next(this.data);
  }
}

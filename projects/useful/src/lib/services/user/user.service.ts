import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { OptionService, Profile, User } from '@lamnhan/schemata';

import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../../schematas/user/user.service';
import { ProfileDataService } from '../../schematas/profile/profile.service';

export type AuthNativeUser = firebase.User; // | SheetbaseUser

export interface UserOptions {
  profilePublished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private options!: UserOptions;
  private userDataService!: UserDataService;
  private profileDataService?: ProfileDataService;

  private nativeUser?: AuthNativeUser;
  private data?: User;

  public readonly onUserChanged = new ReplaySubject<undefined | User>(1);

  constructor(private authService: AuthService) {}
  
  init(
    options: UserOptions,
    userDataService: UserDataService,
    profileDataService?: ProfileDataService
  ) {
    this.options = options;
    this.userDataService = userDataService;
    this.profileDataService = profileDataService;
    // watch for auth
    this.authService
      .onAuthStateChanged
      .pipe(
        switchMap(nativeUser => combineLatest([
          of(nativeUser),
          nativeUser?.uid
            ? this.userDataService.flatDoc(nativeUser.uid)
            : of(undefined),
        ])),
        switchMap(([nativeUser, userDoc]) =>
          this.handleAuthChanged(nativeUser, userDoc)),
      )
      .subscribe(({nativeUser, data}) => {
        // set data
        this.nativeUser = nativeUser;
        this.data = data;
        // user changed
        this.onUserChanged.next(this.data);
      });
    // done
    return this as UserService;
  }

  get NATIVE_USER() {
    return this.nativeUser;
  }

  get DATA() {
    return this.data;
  }

  private handleAuthChanged(
    nativeUser: null | AuthNativeUser,
    userDoc?: User,
  ) {
    // no user
    if (!nativeUser) {
      return of({ nativeUser: undefined, data: undefined });
    }
    // has user
    else {
      // current user
      if (userDoc && (!this.profileDataService || userDoc?.username)) {
        const data = this.proccessUserData(nativeUser, userDoc);
        return of({ nativeUser, data });
      }
      // new user
      else {
        // create initial user record
        const userDoc = {
          uid: nativeUser.uid,
        } as User;
        const data = this.proccessUserData(nativeUser, userDoc);
        // no profiles collection
        if (!this.profileDataService) {
          return this.userDataService
            .add(id, userDoc)
            .pipe(
              map(() => ({ nativeUser, data }))
            );
        }
        // has profiles collection
        else {
          // create initial profile record
          const profileDoc = {
            id: '', // username
            title: '', // displayName
            status: this.options.profilePublished ? 'publish' : 'draft',
            uid: nativeUser.uid,
          } as Profile;
          return this.options
            .add(id, userDoc)
            .pipe(
              switchMap(() => (this.profileDataService as ProfileDataService).add(id, profileDoc)),
              map(() => ({ nativeUser, data }))
            );
        }
      }
    }
  }

  private proccessUserData(
    nativeUser: AuthNativeUser,
    userDoc: User
  ) {
    const data = userDoc;
    data.isAnonymous = nativeUser.isAnonymous ?? undefined;
    data.emailVerified = nativeUser.emailVerified ?? undefined;
    data.uid = nativeUser.uid ?? undefined;
    data.email = nativeUser.email ?? undefined;
    data.phoneNumber = nativeUser.phoneNumber ?? undefined;
    data.providerId = (nativeUser.providerId ?? undefined) as any;
    data.providerData = (nativeUser.providerData ?? undefined) as any;
    data.metadata = nativeUser.metadata ?? undefined;
    data.displayName = nativeUser.displayName ?? undefined;
    data.photoURL = nativeUser.photoURL ?? undefined;
    return data as User;
  }
}

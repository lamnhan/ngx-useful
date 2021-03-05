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
        // no profiles collection
        const defaultUsername = nativeUser.email
          ? nativeUser.email.split('@').shift() as string
          : nativeUser.uid.substr(-7);
        const userInitilizer = (usernameExists: boolean, username: string) => {
          const userDoc = {
            uid: nativeUser.uid,
            username: usernameExists ? nativeUser.uid : username,
          } as User;
          return this.userDataService
            .add(nativeUser.uid, userDoc)
            .pipe(map(() => this.proccessUserData(nativeUser, userDoc)));
        };
        if (!this.profileDataService) {
          // username = uid
          return userInitilizer(true, defaultUsername).pipe(
            map(data => ({ nativeUser, data }))
          );
        }
        // has profiles collection
        else {
          // create initial profile record
          return this.profileDataService.exists(defaultUsername).pipe(
            switchMap(exists => userInitilizer(exists, defaultUsername)),
            switchMap(data => {
              const username = data.username as string; // pass down from userInitilizer()
              const profileDoc = {
                id: username,
                title: data.displayName || username,
                status: this.options.profilePublished ? 'publish' : 'draft',
                uid: nativeUser.uid,
              } as Profile;
              return (this.profileDataService as ProfileDataService)
                .add(username, profileDoc)
                .pipe(map(() => data));
            }),
            map(data => ({ nativeUser, data }))
          );
        }
      }
    }
  }

  private proccessUserData(
    nativeUser: AuthNativeUser,
    userDoc: User
  ) {
    return {
      ...userDoc,
      isAnonymous: nativeUser.isAnonymous ?? undefined,
      emailVerified: nativeUser.emailVerified ?? undefined,
      uid: nativeUser.uid ?? undefined,
      email: nativeUser.email ?? undefined,
      phoneNumber: nativeUser.phoneNumber ?? undefined,
      providerId: (nativeUser.providerId ?? undefined) as any,
      providerData: (nativeUser.providerData ?? undefined) as any,
      metadata: nativeUser.metadata ?? undefined,
      displayName: nativeUser.displayName ?? undefined,
      photoURL: nativeUser.photoURL ?? undefined,
    } as User;
  }
}

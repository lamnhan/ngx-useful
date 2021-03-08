import { Injectable } from '@angular/core';
import { ReplaySubject, of, from, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { Profile, User } from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
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

  private isUser?: boolean;
  private nativeUser?: AuthNativeUser;
  private data?: User;
  private publicData?: Profile;

  public readonly onUserChanged = new ReplaySubject<undefined | User>(1);

  constructor(
    private helperService: HelperService,
    private authService: AuthService
  ) {}
  
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
        switchMap(nativeUser =>
          combineLatest([
            of(nativeUser),
            // get user doc
            nativeUser?.uid
              ? this.userDataService.flatDoc(nativeUser.uid)
              : of(undefined),
            // get profile doc
            nativeUser?.uid && this.profileDataService
              ? this.profileDataService.flatDoc(ref => ref.where('uid', '==', nativeUser.uid))
              : of(undefined)
          ])
        ),
        switchMap(([nativeUser, userDoc, profileDoc]) =>
          this.handleAuthChanged(nativeUser, userDoc, profileDoc)
        ),
      )
      .subscribe(({nativeUser, data, publicData}) => {
        // set data
        this.isUser = !!(nativeUser && data);
        this.nativeUser = nativeUser;
        this.data = data;
        this.publicData = publicData;
        // user changed
        this.onUserChanged.next(this.data);
      });
    // done
    return this as UserService;
  }

  get IS_USER() {
    return this.isUser;
  }

  get NATIVE_USER() {
    return this.nativeUser;
  }

  get DATA() {
    return this.data;
  }

  get PUBLIC_DATA() {
    return this.publicData;
  }

  private handleAuthChanged(
    nativeUser: null | AuthNativeUser,
    userDoc?: User,
    profileDoc?: Profile
  ) {
    // no user (not yet signed in or signed out)
    if (!nativeUser) {
      return of({ nativeUser: undefined, data: undefined, publicData: undefined });
    }
    // has user (signed up or signed in)
    // without /profiles
    else if (!this.profileDataService) {
      return !userDoc
        ? this.userInitializer(nativeUser)
        : this.proccessUserData(nativeUser, userDoc);
    }
    // with /profiles
    else {
      const defaultUsername = nativeUser.email
        ? nativeUser.email.split('@').shift() as string
        : nativeUser.uid.substr(-7);
      return !userDoc
        ? this.profileDataService.exists(defaultUsername).pipe(
          switchMap(exists =>
            this.userInitializer(nativeUser, !exists ? defaultUsername : nativeUser.uid)
          ),
          switchMap(({data}) =>
            this.profileInitializer(nativeUser, data)
          ),
        )
        : this.proccessUserData(nativeUser, userDoc).pipe(
          switchMap(({data}) =>
            !profileDoc
              ? this.profileInitializer(nativeUser, data)
              : of({ nativeUser, data, publicData: profileDoc })
          )
        );
    }
  }

  private userInitializer(nativeUser: AuthNativeUser, username?: string) {
    const {uid} = nativeUser;
    const userDoc = { uid, username: username || uid } as User;
    return this.userDataService.add(uid, userDoc).pipe(
      switchMap(() => this.proccessUserData(nativeUser, userDoc)),
    );
  }

  private profileInitializer(nativeUser: AuthNativeUser, data: User) {
    const time = new Date().toISOString();
    const uid = nativeUser.uid;
    const username = data.username as string;
    const displayName = data.displayName as string;
    // basic fields
    const {profilePublished} = this.options;
    const profileDoc: Profile = {
      uid,
      id: username,
      title: profilePublished ? displayName : username,
      status: profilePublished ? 'publish' : 'draft',
      createdAt: time,
      updatedAt: time,
    };
    // custom fields
    if (profilePublished) {
      const {
        photoURL,
        coverPhoto,
        intro,
        detail,
        url,
        email,
        phoneNumber,
        additionalData,
        publicly,
      } = data;
      if (photoURL) {
        profileDoc.thumbnail = photoURL;
      }
      if (coverPhoto) {
        profileDoc.image = coverPhoto;
      }
      if (intro) {
        profileDoc.description = intro;
      }
      if (detail) {
        profileDoc.content = detail;
      }
      if (url) {
        profileDoc.url = url;
      }
      // special fields
      if (email && publicly?.email) {
        profileDoc.email = email;
      }
      if (phoneNumber && publicly?.phoneNumber) {
        profileDoc.phoneNumber = phoneNumber;
      }
      if (additionalData) {
        const props = {} as Record<string, unknown>;
        Object.keys(additionalData).forEach(key =>
          publicly?.[key] ? !!(props[key] = additionalData[key]) : false  
        );
        profileDoc.props = props;
      }
    }
    return (this.profileDataService as ProfileDataService).add(username, profileDoc).pipe(
      map(() => ({ nativeUser, data, publicData: profileDoc }))
    );
  }

  private proccessUserData(nativeUser: AuthNativeUser, userDoc: User) {
    return from(nativeUser.getIdTokenResult()).pipe(map(idTokenResult => {
      const data = {
        ...userDoc,
        isAnonymous: nativeUser.isAnonymous ?? undefined,
        emailVerified: nativeUser.emailVerified ?? undefined,
        uid: nativeUser.uid ?? undefined,
        email: nativeUser.email ?? undefined,
        phoneNumber: nativeUser.phoneNumber ?? undefined,
        providerId: (nativeUser.providerId ?? undefined) as any,
        providerData: (nativeUser.providerData ?? undefined) as any,
        metadata: nativeUser.metadata ?? undefined,
        claims: idTokenResult.claims ?? undefined,
        displayName: nativeUser.displayName ?? userDoc.username,
        photoURL: nativeUser.photoURL ?? `https://www.gravatar.com/avatar/${this.helperService.md5(nativeUser.email||'user@lamnhan.com')}?d=retro`,
      } as User;
      return { nativeUser, data, publicData: undefined };
    }));
  }
}

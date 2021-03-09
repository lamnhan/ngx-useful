import { Injectable } from '@angular/core';
import { ReplaySubject, of, from, throwError, combineLatest, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';
import {
  Profile,
  User,
  UserEditableProfile,
  UserSettings,
  UserAddress,
  UserPublicly,
} from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
import { NullableOptional } from '../database/database.service';
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
    return !!(this.nativeUser && this.data && (!this.profileDataService || this.publicData));
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

  checkUsernameExists(username: string) {
    return !this.profileDataService
      ? of(true)
      : this.profileDataService.exists(username);
  }

  changeEmail(email: string) {
    // TODO
    console.log('TODO: ...');
  }

  changePhoneNumber(phoneNumber: string) {
    // TODO
    console.log('TODO: ...');
  }

  changeUsername(username: string) {
    return this.checkUsernameExists(username).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError('User exists with the username: ' + username);
        }
        if (!this.nativeUser || !this.data || !this.publicData || !this.profileDataService) {
          return throwError('Can not change username.');
        }
        const uid = this.nativeUser.uid;
        const currentUsername = this.data.username as string;
        // in service
        this.data.username = username;
        this.publicData.id = username;
        // remotely
        return this.userDataService.update(uid, {username}).pipe(
          // remove current doc from /profiles
          switchMap(() =>
            (this.profileDataService as ProfileDataService).delete(currentUsername)
          ),
          // add new doc to /profiles
          switchMap(() =>
            this.profileInitializer(this.nativeUser as AuthNativeUser, this.data as User)
          ),
        );
      }),
    );
  }

  updateSettings(settings: UserSettings) {
    if (!this.nativeUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.nativeUser.uid;
    // in service
    this.data.settings = { ...this.data?.settings, ...settings };
    // remotely
    return this.userDataService.update(uid, { settings: this.data.settings });
  }

  updateAddresses(addresses: string | Record<string, string | UserAddress>) {
    if (!this.nativeUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.nativeUser?.uid as string;
    // in service
    if (!this.data?.addresses || typeof this.data.addresses === 'string') {
      this.data.addresses = addresses;
    } else {
      this.data.addresses = {
        ...this.data.addresses,
        ...(
          typeof addresses === 'string'
            ? {[new Date().getTime()]: addresses}
            : addresses
        )
      };
    }
    // remotely
    return this.userDataService.update(uid, { addresses: this.data.addresses });
  }

  updatePublicity(publicly: UserPublicly) {
    if (!this.nativeUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.nativeUser.uid;
    const username = this.data.username as string;
    // in service
    let profileDoc: Partial<Profile> | NullableOptional<Partial<Profile>>;
    Object.keys(publicly).forEach(key => {
      if (this.data) {
        if (publicly[key] === true) {
          // user doc
          this.data.publicly = {
            ...this.data.publicly,
            ...{ [key]: true }
          };
          // profile doc
          if (this.publicData) {
            const {email, phoneNumber, additionalData} = this.data;
            if (key === 'email') {
              this.publicData.email = email;
              profileDoc = {...profileDoc, email};
            } else if (key === 'phoneNumber') {
              this.publicData.phoneNumber = phoneNumber;
              profileDoc = {...profileDoc, phoneNumber};
            } else if (additionalData?.[key]) {
              const data = additionalData[key];
              this.publicData.props = {...this.publicData.props, [key]: data};
              profileDoc = {...profileDoc, props: this.publicData.props};
            }
          }
        } else {
          // user doc
          delete this.data.publicly?.[key];
          // profile doc
          if (this.publicData) {
            if (key === 'email') {
              delete this.publicData.email;
              profileDoc = {...profileDoc, email: null};
            } else if (key === 'phoneNumber') {
              delete this.publicData.phoneNumber;
              profileDoc = {...profileDoc, phoneNumber: null};
            } else if (this.publicData.props) {
              delete this.publicData.props[key];
              profileDoc = {
                ...profileDoc,
                props: (!this.publicData.props || !Object.keys(this.publicData.props).length)
                  ? null
                  : this.publicData.props
              };
            }
          }
        }
      }
    });
    return this.userDataService.update(uid, {
      publicly: (!this.data.publicly || !Object.keys(this.data.publicly).length)
        ? null
        : this.data.publicly
    }).pipe(
      switchMap(() =>
        this.profileDataService
          ? this.profileDataService.update(username, profileDoc)
          : of(undefined)
      ),
    );
  }

  updateAdditionalData(
    data: Record<string, unknown>,
    publicity?: Record<string, boolean>
  ) {
    if (!this.nativeUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.nativeUser.uid;
    // in service
    this.data.additionalData = {...this.data.additionalData, ...data};
    // remotely
    return this.userDataService.update(uid, { additionalData: this.data.additionalData }).pipe(
      switchMap(() =>
        publicity
          ? this.updatePublicity(publicity)
          : of(undefined)
      ),
    );
  }

  updateProfile(data: UserEditableProfile) {
    if (!this.nativeUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.nativeUser.uid;
    const username = this.data.username as string;
    // extract data
    const { displayName, photoURL, coverPhoto, intro, detail, url } = data;
    let userDoc: undefined | UserEditableProfile;
    let profileDoc: undefined | Partial<Profile>;
    let nativeProfile: undefined | {displayName?: string; photoURL?: string};
    if (displayName) {
      userDoc = {...userDoc, displayName};
      profileDoc = {...profileDoc, title: displayName};
      nativeProfile = {...nativeProfile, displayName};
    }
    if (photoURL) {
      userDoc = {...userDoc, photoURL};
      profileDoc = {...profileDoc, thumbnail: photoURL};
      nativeProfile = {...nativeProfile, photoURL};
    }
    if (coverPhoto) {
      userDoc = {...userDoc, coverPhoto};
      profileDoc = {...profileDoc, image: coverPhoto};
    }
    if (intro) {
      userDoc = {...userDoc, intro};
      profileDoc = {...profileDoc, description: intro};
    }
    if (detail) {
      userDoc = {...userDoc, detail};
      profileDoc = {...profileDoc, content: detail};
    }
    if (url) {
      userDoc = {...userDoc, url};
      profileDoc = {...profileDoc, url};
    }
    // in service
    this.data = {...this.data, ...userDoc};
    this.publicData = {...this.publicData, ...(profileDoc as Profile)};
    // remotely
    return combineLatest([
      // update native profile
      nativeProfile && this.nativeUser
        ? from(this.nativeUser.updateProfile(nativeProfile))
        : of(undefined),
      // update user doc
      userDoc
        ? this.userDataService.update(uid, userDoc)
        : of(undefined),
      // update profile doc
      profileDoc && this.profileDataService
        ? this.profileDataService.update(username, profileDoc)
        : of(undefined),
    ]);
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

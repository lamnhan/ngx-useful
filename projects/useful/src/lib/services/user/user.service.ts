import { Injectable } from '@angular/core';
import { ReplaySubject, of, from, throwError, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import firebase from 'firebase/app';
import {
  Profile,
  User,
  UserEditableProfile,
  UserSettings,
  UserAddress,
  UserPublicly,
  UserClaims,
  UserRoles,
} from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
import { NullableOptional, DatabaseData } from '../database/database.service';
import { AuthService } from '../auth/auth.service';


export type NativeUser = firebase.User;
export type NativeUserCredential = firebase.auth.UserCredential;

export type UserDataService = DatabaseData<User>;
export type ProfileDataService = DatabaseData<Profile>;

export interface UserOptions {
  profilePublished?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private options: UserOptions = {};
  private userDataService!: UserDataService;
  private profileDataService!: ProfileDataService;

  currentUser?: NativeUser;
  data?: User;
  publicData?: Profile;

  uid?: string;
  username?: string;
  role: UserRoles = 'subscriber';
  level = 1;

  public readonly onUserChanged = new ReplaySubject<undefined | User>(1);

  constructor(
    private helperService: HelperService,
    private authService: AuthService
  ) {}

  setOptions(options: UserOptions) {
    this.options = options;
    return this as UserService;
  }
  
  init(
    userDataService: UserDataService,
    profileDataService: ProfileDataService
  ) {
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
            nativeUser?.uid
              ? this.profileDataService.flatDoc(
                ref => ref
                  .where('uid', '==', nativeUser.uid)
                  .where('type', '==', 'user')
              )
              : of(undefined)
          ])
        ),
        switchMap(([nativeUser, currentUserDoc, currentProfileDoc]) =>
          this.handleAuthChanged(nativeUser, currentUserDoc, currentProfileDoc)
        ),
        switchMap(({nativeUser, data, publicData}) =>
          this.publicProfilePatcher(nativeUser, data, publicData)
        ),
        catchError(() =>
          of({nativeUser: undefined, data: undefined, publicData: undefined})
        ),
      )
      .subscribe(({nativeUser, data, publicData}) => {
        // set data
        this.currentUser = nativeUser;
        this.data = data;
        this.publicData = publicData;
        this.uid = this.currentUser?.uid;
        this.username = this.data?.username;
        this.role = this.getRole(this.data?.claims);
        this.level = this.getLevel(this.role);
        // user changed
        this.onUserChanged.next(this.data);
      });
    // done
    return this as UserService;
  }

  allowedLevel(atLeast: number) {
    return this.level >= atLeast;
  }

  checkUsernameExists(username: string) {
    return this.profileDataService.exists(username);
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
        if (!this.currentUser || !this.data || !this.publicData) {
          return throwError('Can not change username.');
        }
        const uid = this.currentUser.uid;
        const currentUsername = this.data.username as string;
        // in service
        this.data.username = username;
        this.publicData.id = username;
        this.username = username;
        // remotely
        return this.userDataService.update(uid, {username}).pipe(
          // remove current doc from /profiles
          switchMap(() =>
            this.profileDataService.delete(currentUsername)
          ),
          // add new doc to /profiles
          switchMap(() =>
            this.profileInitializer(this.currentUser as NativeUser, this.data as User)
          ),
        );
      }),
    );
  }

  changePublicity(toPublic = false) {
    if (!this.currentUser || !this.data || !this.publicData) {
      return throwError('No user.');
    }
    // TODO
    return throwError('TODO: ...');
  }

  updateSettings(settings: UserSettings) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
    // in service
    this.data.settings = { ...this.data?.settings, ...settings };
    // remotely
    return this.userDataService.update(uid, { settings: this.data.settings });
  }

  updateAddresses(addresses: Record<string, UserAddress>) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser?.uid as string;
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

  updatePublicly(publicly: UserPublicly) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
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
        this.profileDataService.update(username, profileDoc)
      ),
    );
  }

  updateAdditionalData(
    data: Record<string, unknown>,
    publicly?: Record<string, boolean>
  ) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
    // in service
    this.data.additionalData = {...this.data.additionalData, ...data};
    // remotely
    return this.userDataService.update(uid, { additionalData: this.data.additionalData }).pipe(
      switchMap(() =>
        publicly
          ? this.updatePublicly(publicly)
          : of(undefined)
      ),
    );
  }

  updateProfile(data: UserEditableProfile) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
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
      nativeProfile && this.currentUser
        ? from(this.currentUser.updateProfile(nativeProfile))
        : of(undefined),
      // update user doc
      userDoc
        ? this.userDataService.update(uid, userDoc)
        : of(undefined),
      // update profile doc
      profileDoc
        ? this.profileDataService.update(username, profileDoc)
        : of(undefined),
    ]);
  }

  private publicProfilePatcher(nativeUser?: NativeUser, data?: User, publicData?: Profile) {
    // signed up or signed in
    if (nativeUser && data && publicData) {
      const { displayName, photoURL } = data;
      const { id, title, thumbnail } = publicData;
      let profileUpdates: undefined | Partial<Profile>;
      if (displayName && (!title || title !== displayName)) {
        profileUpdates = {...profileUpdates, title: displayName};
      }
      if (photoURL && (!thumbnail || thumbnail !== photoURL)) {
        profileUpdates = {...profileUpdates, thumbnail: photoURL};
      }
      return !profileUpdates
        ? of({nativeUser, data, publicData})
        : this.profileDataService.update(id, profileUpdates).pipe(
          map(() => ({nativeUser, data, publicData: {...publicData, ...profileUpdates}}))
        );
    }
    // no user or signed out
    else {
      return of({nativeUser, data, publicData});
    }
  }

  private handleAuthChanged(
    nativeUser: null | NativeUser,
    currentUserDoc?: null | User,
    currentProfileDoc?: null | Profile
  ) {
    // no user (not yet signed in or signed out)
    if (!nativeUser) {
      return of({ nativeUser: undefined, data: undefined, publicData: undefined });
    }
    // has user (signed up or signed in)
    else {
      const nativeUsername = this.authService.credential?.additionalUserInfo?.username;
      const defaultUsername = nativeUsername
        ? nativeUsername
        : nativeUser.email
          ? nativeUser.email.split('@').shift() as string
          : nativeUser.uid.substr(-7);
      return !currentUserDoc
        // new user (create record in users/ and profiles/)
        ? this.profileDataService.exists(defaultUsername).pipe(
          switchMap(exists =>
            this.userInitializer(nativeUser, !exists ? defaultUsername : nativeUser.uid)
          ),
          switchMap(userDoc =>
            this.profileInitializer(nativeUser, userDoc)
          ),
        )
        // existing user
        : this.proccessUserData(nativeUser, currentUserDoc).pipe(
          switchMap(userDoc =>
            !currentProfileDoc
              // some how no record in profiles/ (add one)
              ? this.profileInitializer(nativeUser, userDoc)
              // everything is ok
              : of({ nativeUser, data: userDoc, publicData: currentProfileDoc })
          ),
        );
    }
  }

  private userInitializer(nativeUser: NativeUser, username: string) {
    const {uid} = nativeUser;
    const userDoc = {uid, username} as User;
    return this.userDataService.add(uid, userDoc).pipe(
      switchMap(() => this.proccessUserData(nativeUser, userDoc)),
    );
  }

  private profileInitializer(nativeUser: NativeUser, userDoc: User) {
    const uid = nativeUser.uid;
    const username = userDoc.username as string;
    const displayName = userDoc.displayName as string;
    // basic fields
    const {profilePublished} = this.options;
    const profileDoc: Profile = {
      uid,
      id: username,
      title: profilePublished ? displayName : username,
      status: profilePublished ? 'publish' : 'draft',
      type: 'user',
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
      } = userDoc;
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
    return this.profileDataService.add(username, profileDoc).pipe(
      map(() => ({ nativeUser, data: userDoc, publicData: profileDoc }))
    );
  }

  private proccessUserData(nativeUser: NativeUser, userDoc: User) {
    return from(nativeUser.getIdTokenResult()).pipe(
      map(idTokenResult => {
        const isNew = !!this.authService.credential?.additionalUserInfo?.isNewUser;
        return {
          ...userDoc,
          isAnonymous: nativeUser.isAnonymous ?? false,
          isNew,
          emailVerified: nativeUser.emailVerified ?? false,
          uid: nativeUser.uid,
          email: nativeUser.email ?? '',
          phoneNumber: nativeUser.phoneNumber ?? '',
          providerId: nativeUser.providerId,
          providerData: nativeUser.providerData ?? undefined,
          metadata: nativeUser.metadata,
          claims: idTokenResult.claims,
          displayName: nativeUser.displayName ?? userDoc.username,
          photoURL: nativeUser.photoURL ?? `https://www.gravatar.com/avatar/${this.helperService.md5(nativeUser.email||'user@lamnhan.com')}?d=retro`,
        } as User;
      }),
    );
  }

  private getRole(claims: UserClaims = {}) {
    return claims.role || 'subscriber';
  }

  private getLevel(role?: UserRoles) {
    return role === 'sadmin' ? 6
      :  role === 'admin' ? 5
      :  role === 'editor' ? 4
      :  role === 'author' ? 3
      :  role === 'contributor' ? 2
      : 1;
  }
}

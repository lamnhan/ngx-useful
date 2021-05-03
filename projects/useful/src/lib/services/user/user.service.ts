import { Injectable } from '@angular/core';
import { ReplaySubject, of, from, throwError, combineLatest } from 'rxjs';
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
import { UserDataService } from '../../../schemata/services/user/user.service';
import { ProfileDataService } from '../../../schemata/services/profile/profile.service';

export type NativeUser = firebase.User;
export type NativeUserCredential = firebase.auth.UserCredential;

export interface UserOptions {
  profilePublished?: boolean;
}

export interface UserIntegrations {
  profileDataService?: ProfileDataService
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userDataService!: UserDataService;
  private options: UserOptions = {};
  private integrations: UserIntegrations = {};

  currentUser?: NativeUser;
  data?: User;
  publicData?: Profile;
  uid?: string;
  username?: string;
  role = 'subscriber';
  level = 1;

  public readonly onUserChanged = new ReplaySubject<undefined | User>(1);

  constructor(
    private helperService: HelperService,
    private authService: AuthService
  ) {}
  
  init(
    userDataService: UserDataService,
    options: UserOptions = {},
    integrations: UserIntegrations = {},
  ) {
    this.userDataService = userDataService;
    this.options = options;
    this.integrations = integrations;
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
            nativeUser?.uid && this.integrations.profileDataService
              ? this.integrations.profileDataService.flatDoc(ref => ref.where('uid', '==', nativeUser.uid))
              : of(undefined)
          ])
        ),
        switchMap(([nativeUser, userDoc, profileDoc]) =>
          this.handleAuthChanged(nativeUser, userDoc, profileDoc)
        ),
        switchMap(({nativeUser, data, publicData}) =>
          this.publicProfilePatcher(nativeUser, data, publicData)
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
        this.level = this.getLevel(this.data?.claims);
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
    return !this.integrations.profileDataService
      ? of(true)
      : this.integrations.profileDataService.exists(username);
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
        if (!this.currentUser || !this.data || !this.publicData || !this.integrations.profileDataService) {
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
            (this.integrations.profileDataService as ProfileDataService).delete(currentUsername)
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
    if (!this.currentUser || !this.data || !this.publicData || !this.integrations.profileDataService) {
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
        this.integrations.profileDataService
          ? this.integrations.profileDataService.update(username, profileDoc)
          : of(undefined)
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
      profileDoc && this.integrations.profileDataService
        ? this.integrations.profileDataService.update(username, profileDoc)
        : of(undefined),
    ]);
  }

  private publicProfilePatcher(nativeUser?: NativeUser, data?: User, publicData?: Profile) {
    if (nativeUser && data && this.integrations.profileDataService && publicData) {
      const { displayName, photoURL } = data;
      const { id, title, thumbnail } = publicData;
      let profileDoc: undefined | Partial<Profile>;
      if (displayName && (!title || title !== displayName)) {
        profileDoc = {...profileDoc, title: displayName};
      }
      if (photoURL && (!thumbnail || thumbnail !== photoURL)) {
        profileDoc = {...profileDoc, thumbnail: photoURL};
      }
      return !profileDoc
        ? of({nativeUser, data, publicData})
        : this.integrations.profileDataService.update(id, profileDoc).pipe(
          map(() => ({nativeUser, data, publicData: {...publicData, ...profileDoc}}))
        );
    } else {
      return of({nativeUser, data, publicData});
    }
  }

  private handleAuthChanged(
    nativeUser: null | NativeUser,
    userDoc?: null | User,
    profileDoc?: null | Profile
  ) {
    // no user (not yet signed in or signed out)
    if (!nativeUser) {
      return of({ nativeUser: undefined, data: undefined, publicData: undefined });
    }
    // has user (signed up or signed in)
    // without /profiles
    else if (!this.integrations.profileDataService) {
      return !userDoc
        ? this.userInitializer(nativeUser)
        : this.proccessUserData(nativeUser, userDoc);
    }
    // with /profiles
    else {
      const nativeUsername = this.authService.credential?.additionalUserInfo?.username;
      const defaultUsername = nativeUsername
        ? nativeUsername
        : nativeUser.email
          ? nativeUser.email.split('@').shift() as string
          : nativeUser.uid.substr(-7);
      return !userDoc
        ? this.integrations.profileDataService.exists(defaultUsername).pipe(
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

  private userInitializer(nativeUser: NativeUser, username?: string) {
    const {uid} = nativeUser;
    const userDoc = { uid, username: username || uid } as User;
    return this.userDataService.add(uid, userDoc).pipe(
      switchMap(() => this.proccessUserData(nativeUser, userDoc)),
    );
  }

  private profileInitializer(nativeUser: NativeUser, data: User) {
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
    return (this.integrations.profileDataService as ProfileDataService).add(username, profileDoc).pipe(
      map(() => ({ nativeUser, data, publicData: profileDoc }))
    );
  }

  private proccessUserData(nativeUser: NativeUser, userDoc: User) {
    return from(nativeUser.getIdTokenResult()).pipe(map(idTokenResult => {
      const isNew = this.authService.credential?.additionalUserInfo?.isNewUser;
      const data = {
        ...userDoc,
        isAnonymous: nativeUser.isAnonymous ?? undefined,
        isNew,
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

  private getRole(claims: Record<string, unknown> = {}) {
    const { sadmin, admin, editor, author, contributor } = claims;
    return sadmin ? 'sadmin'
      : admin ? 'admin'
      : editor ? 'editor'
      : author ? 'author'
      : contributor ? 'contributor'
      : 'subscriber';
  }

  private getLevel(claims: Record<string, unknown> = {}) {
    const { sadmin, admin, editor, author, contributor } = claims;
    return sadmin ? 6
      : admin ? 5
      : editor ? 4
      : author ? 3
      : contributor ? 2
      : 1;
  }
}

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
import { UserDataService } from '../../schematas/user/user.service';
import { ProfileDataService } from '../../schematas/profile/profile.service';

export type NativeUser = firebase.User;
export type NativeUserCredential = firebase.auth.UserCredential;

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

  private nativeUser?: NativeUser;
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
        switchMap(({nativeUser, data, publicData}) =>
          this.publicProfilePatcher(nativeUser, data, publicData)
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
  
  get ROLE() {
    const { sadmin, admin, editor, author, contributor } = this.DATA?.claims || {};
    return sadmin ? 'sadmin'
      : admin ? 'admin'
      : editor ? 'editor'
      : author ? 'author'
      : contributor ? 'contributor'
      : 'subscriber';
  }

  get LEVEL() {
    const { sadmin, admin, editor, author, contributor } = this.DATA?.claims || {};
    return sadmin ? 6
      : admin ? 5
      : editor ? 4
      : author ? 3
      : contributor ? 2
      : 1;
  }

  get IS_SUPER_ADMIN() {
    return this.IS_USER && this.isRole('sadmin');
  }

  get IS_ADMIN() {
    return this.IS_USER && this.isRole('admin');
  }

  get IS_EDITOR() {
    return this.IS_USER && this.isRole('editor');
  }

  get IS_AUTHOR() {
    return this.IS_USER && this.isRole('author');
  }

  get IS_CONTRIBUTOR() {
    return this.IS_USER && this.isRole('contributor');
  }

  get IS_SUBSCRIBER() {
    return true;
  }

  isRole(role: string) {
    return this.DATA?.claims?.[role] === true;
  }

  allowedLevel(level: number) {
    return this.LEVEL >= level;
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
            this.profileInitializer(this.nativeUser as NativeUser, this.data as User)
          ),
        );
      }),
    );
  }

  changePublicity(toPublic = false) {
    if (!this.nativeUser || !this.data || !this.publicData || !this.profileDataService) {
      return throwError('No user.');
    }
    // TODO
    return throwError('TODO: ...');
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

  updatePublicly(publicly: UserPublicly) {
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
    publicly?: Record<string, boolean>
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
        publicly
          ? this.updatePublicly(publicly)
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

  private publicProfilePatcher(nativeUser?: NativeUser, data?: User, publicData?: Profile) {
    if (nativeUser && data && this.profileDataService && publicData) {
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
        : this.profileDataService.update(id, profileDoc).pipe(
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
    else if (!this.profileDataService) {
      return !userDoc
        ? this.userInitializer(nativeUser)
        : this.proccessUserData(nativeUser, userDoc);
    }
    // with /profiles
    else {
      const nativeUsername = this.authService.CREDENTIAL?.additionalUserInfo?.username;
      const defaultUsername = nativeUsername
        ? nativeUsername
        : nativeUser.email
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
    return (this.profileDataService as ProfileDataService).add(username, profileDoc).pipe(
      map(() => ({ nativeUser, data, publicData: profileDoc }))
    );
  }

  private proccessUserData(nativeUser: NativeUser, userDoc: User) {
    return from(nativeUser.getIdTokenResult()).pipe(map(idTokenResult => {
      const isNew = this.authService?.CREDENTIAL?.additionalUserInfo?.isNewUser;
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
}

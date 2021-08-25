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
  UserRole,
} from '@lamnhan/schemata';

import { HelperService } from '../helper/helper.service';
import { NullableOptional, DatabaseService, DatabaseData } from '../database/database.service';
import { AuthService } from '../auth/auth.service';

export type NativeUser = firebase.User;
export type NativeUserCredential = firebase.auth.UserCredential;

export type UserDataService = DatabaseData<User>;
export type ProfileDataService = DatabaseData<Profile>;

export interface UserOptions {
  profilePublished?: boolean;
  roleingRegistry?: Record<string, UserRoleing>;
  rankingRegistry?: Record<string, UserRanking>;
  badgingRegistry?: Record<string, UserBadging>;
}

export interface UserRoleing extends UserBadgeAlike {}

export interface UserRanking extends UserBadgeAlike {}

export interface UserBadging extends UserBadgeAlike {}

interface UserBadgeAlike {
  name: string;
  title: string;
  description?: string;
  icon?: string;
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
  role: UserRole = 'subscriber';
  level = 1;

  public readonly onUserChanged = new ReplaySubject<undefined | User>(1);

  constructor(
    private helperService: HelperService,
    private databaseService: DatabaseService,
    private authService: AuthService,
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
              ? this.userDataService.flatGet(nativeUser.uid)
              : of(undefined),
            // get profile doc
            nativeUser?.uid
              ? this.profileDataService.flatGet(
                ref => ref
                  .where('uid', '==', nativeUser.uid)
                  .where('type', '==', 'default')
              )
              : of(undefined)
          ])
        ),
        switchMap(([nativeUser, currentUserDoc, currentProfileDoc]) =>
          this.handleAuthChanged(nativeUser, currentUserDoc, currentProfileDoc)
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

  getRoleingRegistry() {
    return this.options.roleingRegistry || {};
  }

  getRoleing(name: string) {
    return this.options.roleingRegistry?.[name];
  }

  getRankingRegistry() {
    return this.options.rankingRegistry || {};
  }

  getRanking(name: string) {
    return this.options.rankingRegistry?.[name];
  }

  getBadgingRegistry() {
    return this.options.badgingRegistry || {};
  }

  getBadging(name: string) {
    return this.options.badgingRegistry?.[name];
  }

  allowedLevel(atLeast: number) {
    return this.level >= atLeast;
  }

  checkUsernameExists(username: string) {
    return this.profileDataService.exists(username);
  }

  verifyEmail() {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    if (this.data.emailVerified) {
      return throwError('Email already verified.');
    }
    return from(this.currentUser.sendEmailVerification());
  }

  private changeEmail(email: string) {
    console.log('TODO: ...');
  }

  private changePhoneNumber(phoneNumber: string) {
    console.log('TODO: ...');
  }

  private changeUsername(username: string) {
    console.log('TODO: ...');
  }

  changePublicity(toPublic = false) {
    if (!this.currentUser || !this.data || !this.publicData) {
      return throwError('No user.');
    }
    const profileDoc: NullableOptional<Partial<Profile>> = !toPublic
      ? { ...this.getCleanupPublicProfileProperties(), status: 'draft' }
      : { ...this.getPublicProfileProperties(this.data), status: 'publish' };
    // in service
    if (!toPublic) {
      this.publicData.status = 'draft';
      Object.keys(profileDoc).forEach(key => {
        if (this.databaseService.isTypeDelete((profileDoc as any)[key])) {
          delete (this.publicData as any)?.[key];
        }
      });
    } else {
      this.publicData = { ...this.publicData, ...(profileDoc as Partial<Profile>) };
    }
    // remotely
    return this.profileDataService.update(this.publicData.id, profileDoc);
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

  updateAddresses(addresses: UserAddress[]) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser?.uid as string;
    // in service
    if (!this.data?.addresses || typeof this.data.addresses === 'string') {
      this.data.addresses = addresses;
    } else {
      this.data.addresses = [
        ...this.data.addresses,
        ...addresses
      ];
    }
    // remotely
    return this.userDataService.update(uid, { addresses: this.data.addresses });
  }

  updatePublicly(publicly: UserPublicly) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const del = this.databaseService.getValueDelete() as any;
    const uid = this.currentUser.uid;
    const username = this.data.username as string;
    // in service
    let profileDoc: Partial<Profile> | NullableOptional<Partial<Profile>> = {};
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
              profileDoc = {...profileDoc, email: del};
            } else if (key === 'phoneNumber') {
              delete this.publicData.phoneNumber;
              profileDoc = {...profileDoc, phoneNumber: del};
            } else if (this.publicData.props) {
              delete this.publicData.props[key];
              profileDoc = {
                ...profileDoc,
                props: (!this.publicData.props || !Object.keys(this.publicData.props).length)
                  ? del
                  : this.publicData.props
              };
            }
          }
        }
      }
    });
    return combineLatest([
      this.userDataService.update(uid, {
        publicly: (!this.data.publicly || !Object.keys(this.data.publicly).length)
          ? this.databaseService.getValueDelete() as any
          : this.data.publicly
      }),
      this.profileDataService.update(username, profileDoc)
    ]);
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

  updateProfile(
    data:
      UserEditableProfile &
      { thumbnails?: Record<string, {name: string, src: string}> } &
      { images?: Record<string, {name: string, src: string}> }
  ) {
    if (!this.currentUser || !this.data) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
    const username = this.data.username as string;
    // extract data
    const { displayName, photoURL, thumbnails, coverPhoto, images, intro, detail, url } = data;
    let userDoc: undefined | UserEditableProfile;
    let profileDoc: undefined | Partial<Profile>;
    let nativeProfile: undefined | {displayName?: string; photoURL?: string};
    if (displayName) {
      userDoc = {...userDoc, displayName};
      profileDoc = {...profileDoc, title: displayName};
      nativeProfile = {...nativeProfile, displayName};
    }
    if (photoURL && thumbnails) {
      userDoc = {...userDoc, photoURL};
      profileDoc = {
        ...profileDoc,
        thumbnails: {
          ...thumbnails,
          default: { name: 'default', src: photoURL },
        },
      };
      nativeProfile = {...nativeProfile, photoURL};
    }
    if (coverPhoto && images) {
      userDoc = {...userDoc, coverPhoto};
      profileDoc = {
        ...profileDoc,
        images: {
          ...images,
          default: { name: 'default', src: coverPhoto },
        },
      };
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

  removeCoverPhoto() {
    if (!this.currentUser || !this.data || !this.publicData) {
      return throwError('No user.');
    }
    const uid = this.currentUser.uid;
    const username = this.data.username as string;
    const del = this.databaseService.getValueDelete() as any;
    // in service
    delete this.data.coverPhoto;
    delete this.publicData.images;
    // remotely
    return combineLatest([
      // update user doc
      this.userDataService.update(uid, {coverPhoto: del}),
      // update profile doc
      this.profileDataService.update(username, {images: del}),
    ]);
  }

  private getRole(claims: UserClaims = {}) {
    return claims.role || 'subscriber';
  }

  private getLevel(role?: UserRole) {
    return role === 'sadmin' ? 6
      :  role === 'admin' ? 5
      :  role === 'editor' ? 4
      :  role === 'author' ? 3
      :  role === 'contributor' ? 2
      : 1;
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
    const nativeUsername = this.authService.credential?.additionalUserInfo?.username;
    const defaultUsername = nativeUsername
      ? nativeUsername
      : nativeUser.email
        ? nativeUser.email.split('@').shift() as string
        : nativeUser.uid.substr(-7);
    return (currentUserDoc && currentProfileDoc)
      ? this.proccessUserData(nativeUser, currentUserDoc).pipe(
        map(userDoc => ({ nativeUser, data: userDoc, publicData: currentProfileDoc })),
      )
      // new user (create doc in users and profiles collection)
      : this.profileDataService.exists(defaultUsername).pipe(
        // prepare the data
        switchMap(exists => {
          const uid = nativeUser.uid;
          const createdAt = new Date().toISOString();
          const initialUserDoc: User = {
            uid,
            id: uid,
            title: uid,
            type: 'default',
            status: 'publish',
            createdAt,
            updatedAt: createdAt,
            username: !exists ? defaultUsername : nativeUser.uid,
          };
          return this.proccessUserData(nativeUser, initialUserDoc).pipe(
            map(userDoc => ({ initialUserDoc, userDoc })),
          );
        }),
        // create the profile doc, then the user doc
        switchMap(({ initialUserDoc, userDoc }) =>
          this.profileInitializer(nativeUser, userDoc).pipe(
            switchMap(result =>
              this.userDataService.create(nativeUser.uid, initialUserDoc).pipe(map(() => result))
            ),
          )
        ),
      );
  }

  private profileInitializer(nativeUser: NativeUser, userDoc: User) {
    const {profilePublished} = this.options;
    // basic fields
    const uid = nativeUser.uid;
    const username = userDoc.username as string;
    const displayName = userDoc.displayName as string;
    const createdAt = userDoc.createdAt;
    // sum-up
    const profileDoc: Profile = {
      uid,
      id: username,
      title: profilePublished ? displayName : username,
      type: 'default',
      status: profilePublished ? 'publish' : 'draft',
      createdAt,
      updatedAt: createdAt,
      role: 'subscriber',
      // custom fields
      ...(!profilePublished ? {} : this.getPublicProfileProperties(userDoc)),
    };
    return this.profileDataService.create(username, profileDoc).pipe(
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

  private getPublicProfileProperties(data: User) {
    const result: Partial<Profile> = {};
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
    // thumbnail
    if (photoURL) {
      result.thumbnails = {
        default: { name: 'default', src: photoURL },
      };
    }
    // 
    if (coverPhoto) {
      result.images = {
        default: { name: 'default', src: coverPhoto },
      };
    }
    // description
    if (intro) {
      result.description = intro;
    }
    // content
    if (detail) {
      result.content = detail;
    }
    // url
    if (url) {
      result.url = url;
    }
    // email
    if (email && publicly?.email) {
      result.email = email;
    }
    // phone number
    if (phoneNumber && publicly?.phoneNumber) {
      result.phoneNumber = phoneNumber;
    }
    // props
    if (additionalData) {
      const props = {} as Record<string, unknown>;
      Object.keys(additionalData).forEach(key =>
        publicly?.[key] ? !!(props[key] = additionalData[key]) : false  
      );
      result.props = props;
    }
    // result
    return result;
  }

  private getCleanupPublicProfileProperties() {
    const result: NullableOptional<Partial<Profile>> = {};
    const del = this.databaseService.getValueDelete() as any;
    // thumbnail
    result.thumbnails = del;
    // image
    result.images = del;
    // description
    result.description = del;
    // content
    result.content = del;
    // url
    result.url = del;
    // email
    result.email = del;
    // phone number
    result.phoneNumber = del;
    // props
    result.props = del;
    // result
    return result;
  }
}

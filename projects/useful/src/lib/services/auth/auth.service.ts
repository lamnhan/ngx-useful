import { Injectable } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { NativeUser, NativeUserCredential } from '../user/user.service';

export type VendorAuthService = AngularFireAuth; // | AngularSheetbaseAuth

export interface AuthOptions {
  driver?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private options: AuthOptions = {};
  private service!: VendorAuthService;

  private redirectUrl?: null | string;
  private isAuth?: boolean;
  private credential?: NativeUserCredential;

  private methodLock = false;
  private allowedMethods: Record<string, boolean> = {};

  public readonly onAuthStateChanged = new ReplaySubject<null | NativeUser>(1);

  constructor() {}

  init(service: VendorAuthService, options: AuthOptions = {}) {
    this.options = options;
    this.service = service;
    // watch for changed
    this.service.onAuthStateChanged(user => {
      this.isAuth = !!user; // change status
      this.onAuthStateChanged.next(user); // emit
    });
    // done
    return this as AuthService;
  }

  get SERVICE() {
    return this.service;
  }

  get DRIVER() {
    return this.options.driver || 'firebase';
  }

  get REDIRECT_URL() {
    return this.redirectUrl;
  }

  get IS_AUTH() {
    return this.isAuth;
  }

  get CREDENTIAL() {
    return this.credential;
  }

  get IS_METHOD_ALLOWED_FOR_EMAIL_PASWWORD() {
    return this.isMethodAllowed('email/password');
  }

  get IS_METHOD_ALLOWED_FOR_GOOGLE() {
    return this.isMethodAllowed('google.com');
  }

  get IS_METHOD_ALLOWED_FOR_FACEBOOK() {
    return this.isMethodAllowed('facebook.com');
  }

  get IS_METHOD_ALLOWED_FOR_GITHUB() {
    return this.isMethodAllowed('github.com');
  }

  setRedirectUrl(url: null | string) {
    this.redirectUrl = url;
  }

  isMethodAllowed(method: string) {
    return !this.methodLock || this.allowedMethods[method];
  }

  handleAccountExistsWithDifferentCredential(email: string) {
    return from(this.SERVICE.fetchSignInMethodsForEmail(email)).pipe(
      tap(methods => {
        this.methodLock = true;
        methods.forEach(method => this.allowedMethods[method] = true);
      })
    );
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return from(this.SERVICE.createUserWithEmailAndPassword(email, password))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(this.SERVICE.signInWithEmailAndPassword(email, password))
      .pipe(tap(credential => this.credential = credential));
  }

  sendPasswordResetEmail(email: string) {
    return from(this.SERVICE.sendPasswordResetEmail(email));
  }
  
  signInWithPopupForGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithPopupForFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithPopupForGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signOut() {
    return from(this.SERVICE.signOut());
  }
}

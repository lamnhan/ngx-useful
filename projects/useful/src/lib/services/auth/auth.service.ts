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
  private service!: VendorAuthService;
  private options: AuthOptions = {};

  driver = 'firebase';
  redirectUrl?: null | string;
  authenticated?: boolean;
  credential?: NativeUserCredential;

  private methodLock = false;
  private allowedMethods: Record<string, boolean> = {};

  public readonly onAuthStateChanged = new ReplaySubject<null | NativeUser>(1);

  constructor() {}

  init(service: VendorAuthService, options: AuthOptions = {}) {
    this.service = service;
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    // watch for changed
    this.service.onAuthStateChanged(user => {
      this.authenticated = !!user; // change status
      this.onAuthStateChanged.next(user); // emit
    });
    // done
    return this as AuthService;
  }
  
  setRedirectUrl(url: null | string) {
    this.redirectUrl = url;
  }

  isMethodAllowed(method: string) {
    return !this.methodLock || this.allowedMethods[method];
  }

  isMethodAllowedForEmailPassword() {
    return this.isMethodAllowed('email/password');
  }

  isMethodAllowedForGoogle() {
    return this.isMethodAllowed('google.com');
  }

  isMethodAllowedForFacebook() {
    return this.isMethodAllowed('facebook.com');
  }

  isMethodAllowedForGithub() {
    return this.isMethodAllowed('github.com');
  }

  handleAccountExistsWithDifferentCredential(email: string) {
    return from(this.service.fetchSignInMethodsForEmail(email)).pipe(
      tap(methods => {
        this.methodLock = true;
        methods.forEach(method => this.allowedMethods[method] = true);
      })
    );
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return from(this.service.createUserWithEmailAndPassword(email, password))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(this.service.signInWithEmailAndPassword(email, password))
      .pipe(tap(credential => this.credential = credential));
  }

  sendPasswordResetEmail(email: string) {
    return from(this.service.sendPasswordResetEmail(email));
  }
  
  signInWithPopupForGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return from(this.service.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithPopupForFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return from(this.service.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signInWithPopupForGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return from(this.service.signInWithPopup(provider))
      .pipe(tap(credential => this.credential = credential));
  }

  signOut() {
    return from(this.service.signOut());
  }
}

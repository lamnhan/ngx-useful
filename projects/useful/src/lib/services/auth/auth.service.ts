import { Injectable } from '@angular/core';
import { from, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { NativeUser, NativeUserCredential } from '../user/user.service';

export type VendorAuthService = AngularFireAuth; // | AngularSheetbaseAuth

export interface AuthOptions {
  driver?: string;
  additionalClaims?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private options: AuthOptions = {};
  private service!: VendorAuthService;
  driver = 'firebase';

  redirectUrl?: string;
  authenticated?: boolean;
  credential?: NativeUserCredential;

  methodAllowedForEmailPassword = true;
  methodAllowedForGoogle = true;
  methodAllowedForFacebook = true;
  methodAllowedForGithub = true;

  public readonly onAuthStateChanged = new ReplaySubject<null | NativeUser>(1);

  constructor() {}

  setOptions(options: AuthOptions) {
    this.options = options;
    if (options.driver) {
      this.driver = options.driver;
    }
    return this as AuthService;
  }

  init(service: VendorAuthService) {
    this.service = service;
    // watch for changed
    this.service.onAuthStateChanged(user => {
      this.authenticated = !!user; // change status
      this.onAuthStateChanged.next(user); // emit
    });
    // done
    return this as AuthService;
  }

  getClaimNames() {
    return [
      ...(this.options.additionalClaims || []),
      'role',
      'legit',
    ];
  }
  
  setRedirectUrl(url?: string) {
    this.redirectUrl = url;
  }

  handleAccountExistsWithDifferentCredential(email: string) {
    return from(this.service.fetchSignInMethodsForEmail(email)).pipe(
      tap(methods => methods.forEach(method => {
        this.methodAllowedForEmailPassword = method === 'email/password';
        this.methodAllowedForGoogle = method === 'google.com';
        this.methodAllowedForFacebook = method === 'facebook.com';
        this.methodAllowedForGithub = method === 'github.com';
      }))
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

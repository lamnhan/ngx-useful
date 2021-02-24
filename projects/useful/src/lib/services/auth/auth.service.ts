import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AuthService as AngularSheetbaseAuth, User as SheetbaseUser } from '@sheetbase/angular';
import { AuthUser } from '@lamnhan/schemata';

export type AuthDrivers = 'firebase' | 'sheetbase';
export type AuthServices = AngularFireAuth; // | AngularSheetbaseAuth
export type AuthNativeUser = firebase.User; // | SheetbaseUser

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private driver: AuthDrivers = 'firebase';
  private service?: AuthServices;
  private nativeUser: null | AuthNativeUser = null; // native (firebase/sheetbase) user object

  private user: null | AuthUser = null; // @lamnhan/schemata user
  private redirectUrl: null | string = null;

  constructor() {}

  init(service: AuthServices, driver: AuthDrivers = 'firebase') {
    this.driver = driver;
    this.service = service;
    // watch for changed
    if (this.driver === 'firebase') {
      this.service.onAuthStateChanged(user => this.authChanged(user));
    }
  }

  get DRIVER() {
    return this.driver;
  }

  get SERVICE() {
    if (!this.service) {
      throw new Error('No auth service, please run init() first!');
    }
    return this.service;
  }

  get NATIVE_USER() {
    return this.nativeUser;
  }

  get USER() {
    return this.user;
  }

  get REDIRECT_URL() {
    return this.redirectUrl;
  }

  setRedirectUrl(url: null | string) {
    this.redirectUrl = url;
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return from(this.SERVICE.createUserWithEmailAndPassword(email, password));
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(this.SERVICE.signInWithEmailAndPassword(email, password));
  }
  
  signInWithPopupForGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider));
  }

  signInWithPopupForFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider));
  }

  signInWithPopupForGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return from(this.SERVICE.signInWithPopup(provider));
  }

  sendPasswordResetEmail(email: string) {
    return from(this.SERVICE.sendPasswordResetEmail(email));
  }

  signOut() {
    return from(this.SERVICE.signOut());
  }

  private authChanged(nativeUser: null | AuthNativeUser) {
    // raw user
    this.nativeUser = nativeUser;
    // auth user
    if (!nativeUser) {
      this.user = null;
    } else {
      this.user = nativeUser as unknown as AuthUser;
    }
  }
}

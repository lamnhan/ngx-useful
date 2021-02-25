import { Injectable } from '@angular/core';
import { from, Subject } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AuthService as AngularSheetbaseAuth, User as SheetbaseUser } from '@sheetbase/angular';

import { AuthNativeUser } from '../user/user.service';

export type AuthServices = AngularFireAuth; // | AngularSheetbaseAuth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private driver?: string;
  private service?: AuthServices;

  private redirectUrl: null | string = null;
  private isAuth?: boolean;
  public readonly onAuthStateChanged: Subject<null | AuthNativeUser> = new Subject();

  constructor() {}

  init(service: AuthServices, driver?: string) {
    this.service = service;
    this.driver = driver || (service as any).name;
    // watch for changed
    this.service.onAuthStateChanged(user => {
      this.isAuth = !!user; // change status
      this.onAuthStateChanged.next(user); // emit
    });
  }

  get DRIVER() {
    if (!this.driver) {
      throw new Error('Invalid driver, please provide when init().');
    }
    return this.driver;
  }

  get SERVICE() {
    if (!this.service) {
      throw new Error('No auth service, please run init() first!');
    }
    return this.service;
  }

  get REDIRECT_URL() {
    return this.redirectUrl;
  }

  get IS_AUTH() {
    return this.isAuth;
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

  sendPasswordResetEmail(email: string) {
    return from(this.SERVICE.sendPasswordResetEmail(email));
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

  signOut() {
    return from(this.SERVICE.signOut());
  }
}

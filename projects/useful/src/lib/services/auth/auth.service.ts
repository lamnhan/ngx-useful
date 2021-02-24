import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthUser } from '@lamnhan/schemata';

export type AuthServices = AngularFireAuth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private service?: AuthServices;

  private user?: AuthUser;
  private redirectUrl?: string;

  constructor() {}

  init(service: AuthServices) {
    this.service = service;
  }

  get SERVICE() {
    if (!this.service) {
      throw new Error('No auth service, please run init() first!');
    }
    return this.service;
  }

  get USER() {
    return this.user;
  }

  get REDIRECT_URL() {
    return this.redirectUrl;
  }

  saveRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  signInWithEmailAndPassword() {
    console.log('signInWithEmailAndPassword');
  }
  
  signInWithPopup() {
    console.log('signInWithPopup');
  }

  sendPasswordResetEmail() {
    console.log('sendPasswordResetEmail');
  }

}

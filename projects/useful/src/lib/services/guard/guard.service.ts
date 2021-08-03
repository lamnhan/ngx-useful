import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  authHandler: string | string[] = ['login'];
  dashboardHandler: string | string[] = ['login', 'guard', 'dashboard'];
  adminHandler: string | string[] = ['login', 'guard', 'admin'];
  onlineHandler: string | string[] = [''];

  constructor() {}

  setHandlers(values: Record<string, string | string[]>) {
    if (values.auth) {
      this.authHandler = values.auth;
    }
    if (values.dashboard) {
      this.dashboardHandler = values.dashboard;
    }
    if (values.admin) {
      this.adminHandler = values.admin;
    }
    if (values.online) {
      this.onlineHandler = values.online;
    }
    return this as GuardService;
  }
  
  init() {
    return this as GuardService;
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  authHandler: string | string[] = ['login'];
  dashboardHandler: string | string[] = ['admin'];
  adminHandler: string | string[] = ['login'];

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
    return this as GuardService;
  }
  
  init() {
    return this as GuardService;
  }
}

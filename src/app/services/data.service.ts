import { Injectable } from '@angular/core';
import { NavItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // guides
  guideMenu: NavItem[] = [
    {
      text: 'Introduction',
      level: 1,
      routerLink: ['guide', 'introduction']
    },
  ];

  // services
  serviceMenu: NavItem[] = [
    {
      text: 'General',
      level: 0,
    },
      {
        text: 'App',
        level: 1,
        routerLink: ['service', 'app']
      },
      {
        text: 'Meta',
        level: 1,
        routerLink: ['service', 'meta']
      },
      {
        text: 'Nav',
        level: 1,
        routerLink: ['service', 'nav']
      },
      {
        text: 'Setting',
        level: 1,
        routerLink: ['service', 'setting']
      },
    {
      text: 'Services',
      level: 0,
    },
      {
        text: 'Database',
        level: 1,
        routerLink: ['service', 'database']
      },
      {
        text: 'Storage',
        level: 1,
        routerLink: ['service', 'storage']
      },
    {
      text: 'Authentication',
      level: 0,
    },
      {
        text: 'Auth',
        level: 1,
        routerLink: ['service', 'auth']
      },
      {
        text: 'User',
        level: 1,
        routerLink: ['service', 'user']
      },
    {
      text: 'Utilities',
      level: 0,
    },
      {
        text: 'Alert',
        level: 1,
        routerLink: ['service', 'alert']
      },
      {
        text: 'Modal',
        level: 1,
        routerLink: ['service', 'modal']
      },
      {
        text: 'Error',
        level: 1,
        routerLink: ['service', 'error']
      },
      {
        text: 'Fetch',
        level: 1,
        routerLink: ['service', 'fetch']
      },
      {
        text: 'Guard',
        level: 1,
        routerLink: ['service', 'guard']
      },
      {
        text: 'Network',
        level: 1,
        routerLink: ['service', 'network']
      },
      {
        text: 'Localstorage',
        level: 1,
        routerLink: ['service', 'localstorage']
      },
      {
        text: 'Cache',
        level: 1,
        routerLink: ['service', 'cache']
      },
      {
        text: 'Pwa',
        level: 1,
        routerLink: ['service', 'pwa']
      },
      {
        text: 'Persona',
        level: 1,
        routerLink: ['service', 'persona']
      },
      {
        text: 'Helper',
        level: 1,
        routerLink: ['service', 'helper']
      },
  ];

  // pipes
  pipeMenu: NavItem[] = [
    {
      text: 'O1i',
      level: 1,
      routerLink: ['pipe', 'o1i']
    },
    {
      text: 'O2a',
      level: 1,
      routerLink: ['pipe', 'o2a']
    },
    {
      text: 'Safe',
      level: 1,
      routerLink: ['pipe', 'safe']
    },
  ];

  // directives
  directiveMenu: NavItem[] = [
    {
      text: 'Router link',
      level: 1,
      routerLink: ['directive', 'router-link']
    },
  ];

  // guards
  guardMenu: NavItem[] = [
    {
      text: 'Auth',
      level: 1,
      routerLink: ['guard', 'auth']
    },
    {
      text: 'Dashboard',
      level: 1,
      routerLink: ['guard', 'dashboard']
    },
    {
      text: 'Admin',
      level: 1,
      routerLink: ['guard', 'admin']
    },
    {
      text: 'Online',
      level: 1,
      routerLink: ['guard', 'online']
    },
  ];

  constructor() { }
}

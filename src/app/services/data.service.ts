import { Injectable } from '@angular/core';
import { NavItem } from '@lamnhan/ngx-useful';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // guides
  guideMenu: NavItem[] = [];

  // services
  serviceMenu: NavItem[] = [
    {
      text: 'App',
      level: 1,
      routerLink: ['service', 'app']
    },
    {
      text: 'Meta',
      level: 1,
      routerLink: ['service', 'meta']
    }
  ];

  // pipes
  pipeMenu: NavItem[] = [];

  // directives
  directiveMenu: NavItem[] = [];

  // guards
  guardMenu: NavItem[] = [];

  constructor() { }
}

import { Injectable } from '@angular/core';;

import { NavItem } from '../nav/nav.service';
import { SettingService } from '../setting/setting.service';

export interface PersonaBuiltinProperties {
  navItems?: NavItem[],
}

export interface PersonaProperties extends PersonaBuiltinProperties {
  [key: string]: unknown;
}

export type PersonaData = Record<string, PersonaProperties>; 

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private data: PersonaData = {};

  constructor(private settingService: SettingService) {}

  init(data: PersonaData = {}) {
    this.data = {
      default: {},
      ...data,
    };
  }

  get ACTIVE() {
    return this.settingService.PERSONA;
  }

  get NAV_ITEMS() {
    return this.getData('navItems') as NavItem[];
  }

  getData(key: string) {
    return this.data[this.ACTIVE][key] || this.data['default'][key];
  }
}

import { Injectable } from '@angular/core';;

import { MenuItem } from '../nav/nav.service';
import { SettingService } from '../setting/setting.service';

export interface PersonaBuiltinProperties {
  menu?: Array<string | MenuItem>;
  tabs?: Array<string | MenuItem>;
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
  private menuRegistry?: Record<string, MenuItem>;

  constructor(private settingService: SettingService) {}

  init(
    data: PersonaData = {},
    menuRegistry?: Record<string, MenuItem>,
  ) {
    // proccess menu & secondary menu
    if (menuRegistry) {
      Object.keys(data).forEach(persona => {
        const {menu, tabs} = data[persona];
        if (menu) {
          data[persona].menu =
            menu.map(value => typeof value === 'string' ? menuRegistry[value] : value);
        }
        if (tabs) {
          data[persona].tabs =
            tabs.map(value => typeof value === 'string' ? menuRegistry[value] : value);
        }
      });
    }
    // save data
    this.menuRegistry = menuRegistry;
    this.data = data;
  }

  get ACTIVE() {
    return this.settingService.PERSONA;
  }

  get MENU_REGISTRY() {
    return this.menuRegistry;
  }

  get MENU() {
    return this.getData('menu') as MenuItem[];
  }

  get TABS() {
    return this.getData('tabs') as MenuItem[];
  }

  getData(key: string) {
    return (this.data[this.ACTIVE] || {})[key] || (this.data['default'] || {})[key];
  }
}

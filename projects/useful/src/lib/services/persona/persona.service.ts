import { Injectable } from '@angular/core';;

import { MenuItem } from '../nav/nav.service';
import { SettingService } from '../setting/setting.service';

export interface PersonaBuiltinProperties {
  menu?: Array<string | MenuItem>;
  secondaryMenu?: Array<string | MenuItem>;
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
        const {menu, secondaryMenu} = data[persona];
        if (menu) {
          data[persona].menu =
            menu.map(value => typeof value === 'string' ? menuRegistry[value] : value);
        }
        if (secondaryMenu) {
          data[persona].secondaryMenu =
            secondaryMenu.map(value => typeof value === 'string' ? menuRegistry[value] : value);
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

  get MENU() {
    return this.getData('menu') as MenuItem[];
  }

  get SECONDARY_MENU() {
    return this.getData('secondaryMenu') as MenuItem[];
  }

  getData(key: string) {
    return (this.data[this.ACTIVE] || {})[key] || (this.data['default'] || {})[key];
  }
}

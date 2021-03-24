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

export interface PersonaOptions {}

export interface PersonaIntegrations {
  settingService?: SettingService;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private data: PersonaData = {};
  private menuRegistry?: Record<string, MenuItem>;
  private options: PersonaOptions = {};
  private integrations: PersonaIntegrations = {};

  constructor() {}

  init(
    data: PersonaData,
    options: PersonaOptions = {},
    integrations: PersonaIntegrations = {},
    menuRegistry?: Record<string, MenuItem>,
  ) {
    this.options = options;
    this.integrations = integrations;
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
    // done
    return this as PersonaService;
  }

  get MENU_REGISTRY() {
    return this.menuRegistry;
  }

  get MENU() {
    return this.get('menu') as MenuItem[];
  }

  get TABS() {
    return this.get('tabs') as MenuItem[];
  }

  get(key: string, withPersona?: string) {
    const persona = withPersona
      || this.integrations?.settingService?.PERSONA
      || 'default';
    return (this.data[persona] || {})[key] || (this.data['default'] || {})[key];
  }
}

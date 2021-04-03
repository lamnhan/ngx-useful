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
  private menuRegistry?: Record<string, MenuItem>;
  private options: PersonaOptions = {};
  private integrations: PersonaIntegrations = {};
  
  data: PersonaData = {};

  name = 'default';
  properties: PersonaProperties = {};
  menu: MenuItem[] = [];
  tabs: MenuItem[] = [];

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
      this.menuRegistry = menuRegistry;
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
    this.data = data;
    // calculate values
    this.setData('default');
    if (this.integrations.settingService) {
      this.integrations.settingService.onPersonaChanged.subscribe(persona => this.setData(persona));
    }
    // done
    return this as PersonaService;
  }

  get(key: string, withPersona?: string) {
    return (this.data[withPersona || this.name] || {})[key] || (this.data['default'] || {})[key];
  }

  private setData(persona: string) {
    this.name = persona;
    this.properties = this.data[this.name] || this.data['default'] || {};
    this.menu = (this.get('menu') || []) as MenuItem[];
    this.tabs = (this.get('tabs') || []) as MenuItem[];
  }
}

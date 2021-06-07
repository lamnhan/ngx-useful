import { Injectable } from '@angular/core';;

import { MenuItem, NavService } from '../nav/nav.service';
import { SettingService } from '../setting/setting.service';

export interface PersonaBuiltinProperties {
  menu?: Array<string | MenuItem>;
  menu2nd?: Array<string | MenuItem>;
  tabs?: Array<string | MenuItem>;
}

export interface PersonaProperties extends PersonaBuiltinProperties {
  [key: string]: unknown;
}

export type PersonaData = Record<string, PersonaProperties>; 

export interface PersonaOptions {}


export interface PersonaIntegrations {
  settingService?: SettingService;
  navService?: NavService;
}

export interface PersonaAction {
  theme?: string;
  redirect?: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private menuRegistry?: Record<string, MenuItem>;
  private personaActions?: Record<string, PersonaAction>;
  private options: PersonaOptions = {};
  private integrations: PersonaIntegrations = {};
  
  data: PersonaData = {};

  name = 'default';
  properties: PersonaProperties = {};
  menu: MenuItem[] = [];
  menu2nd: MenuItem[] = [];
  tabs: MenuItem[] = [];

  constructor() {}

  init(
    data: PersonaData,
    options: PersonaOptions = {},
    integrations: PersonaIntegrations = {},
    menuRegistry?: Record<string, MenuItem>,
    personaActions?: Record<string, PersonaAction>,
  ) {
    this.options = options;
    this.integrations = integrations;
    this.menuRegistry = menuRegistry;
    this.personaActions = personaActions;
    // proccess menu & secondary menu & tabs
    if (menuRegistry) {
      Object.keys(data).forEach(persona => {
        const {menu, menu2nd, tabs} = data[persona];
        if (menu) {
          data[persona].menu =
            menu.map(value => typeof value === 'string' ? menuRegistry[value] : value);
        }
        if (menu2nd) {
          data[persona].menu2nd =
            menu2nd.map(value => typeof value === 'string' ? menuRegistry[value] : value);
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
    // watch for setting changed
    if (this.integrations.settingService) {
      this.integrations.settingService.onPersonaChanged.subscribe(persona => {
        // re-evaluated data
        this.setData(persona);
        // change theme and redirect (if available)
        const actions = this.personaActions?.[persona];
        if (actions?.theme && this.integrations.settingService) {
          this.integrations.settingService.changeTheme(actions.theme);
        }
        if (actions?.redirect && this.integrations.navService) {
          this.integrations.navService.navigate(actions.redirect);
        }
      });
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
    this.menu2nd = (this.get('menu2nd') || []) as MenuItem[];
    this.tabs = (this.get('tabs') || []) as MenuItem[];
  }
}

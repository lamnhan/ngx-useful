import { Injectable } from '@angular/core';

import { AppService } from '../app/app.service';

export type IconItemsByComponents = Record<string, string>;

export type IconGroupByTheme = Record<string, IconItemsByComponents>;

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private icons: Record<string, IconGroupByTheme> = {};
  private source?: string;

  constructor(private appService: AppService) { }

  init(register: string | Record<string, IconGroupByTheme>) {
    if (register instanceof Object) {
      this.icons = register;
    } else {
      this.source = register;
    }
    return this as IconService;
  }

  getIcon(id: string) {
    const [
      component,
      name = '{icon_name}',
      ext = 'svg'
    ] = id.replace('.', '/').split('/');
    const theme = this.appService.getTheme();
    if (this.source) {
      return `${this.source}/${theme}/${component}/${name}.${ext}`;
    } else {
      const groupByTheme = this.icons[theme] || this.icons['default'] || {};
      const iconsByComponent = groupByTheme[component] || {};
      return iconsByComponent[name];
    }
  }
}

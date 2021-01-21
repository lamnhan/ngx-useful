import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

@Pipe({
  name: 'list'
})
export class ListPipe implements PipeTransform {

  constructor(private helperService: HelperService) {}

  transform(value: any, ... args: any[]): any {
    const [ autoKey = false, separator = ',' ] = args;
    // build items
    const items = [];
    if (typeof value === 'string') {
      for (const val of value.split(separator).map(x => x.trim())) {
        const item = { title: val } as Record<string, unknown>;
        if (!!autoKey) {
          item['$key'] = this.helperService.cleanupStr(val)
          .toLowerCase()
          .replace(/\ /g, '-');
        }
        items.push(item);
      }
    } else {
      for (const key of Object.keys(value)) {
        let item = value[key];
        // turn string to obj
        if (typeof item === 'string') {
          item = { title: item };
        }
        item['$key'] = key; // add $key
        items.push(item);
      }
    }
    return items;
  }

}

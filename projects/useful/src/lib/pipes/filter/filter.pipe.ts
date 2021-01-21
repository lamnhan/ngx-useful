import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(private helperService: HelperService) {}

  transform(items: any[], keyword: string, fields = ['keywords']) {
    return this.helperService.filter(items, keyword, fields);
  }

}

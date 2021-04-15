import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

@Pipe({
  name: 'o1i'
})
export class O1iPipe implements PipeTransform {

  constructor(private helperService: HelperService) {}

  transform(value: {[$key: string]: any}, ... args: any[]) {
    return this.helperService.o1i(value, ...args);
  }
}

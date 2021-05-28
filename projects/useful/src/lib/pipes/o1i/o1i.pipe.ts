import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

/**
 * Select the 1st item in an object
 */
@Pipe({
  name: 'o1i'
})
export class O1iPipe implements PipeTransform {
  constructor(private helperService: HelperService) {}
  transform(value: undefined | null | {[id: string]: any}, ... args: any[]) {
    return !value ? null : this.helperService.o1i(value, ...args);
  }
}

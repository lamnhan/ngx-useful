import { Pipe, PipeTransform } from '@angular/core';

import { HelperService } from '../../services/helper/helper.service';

@Pipe({
  name: 'o2a'
})
export class O2aPipe implements PipeTransform {
  constructor(private helperService: HelperService) {}
  transform(value: undefined | null | {[id: string]: any}, ... args: any[]) {
    return !value ? null : this.helperService.o2a(value, ...args);
  }
}

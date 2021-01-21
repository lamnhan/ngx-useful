import { Pipe, PipeTransform } from '@angular/core';

import { DateService } from '../../services/date/date.service';

@Pipe({
  name: 'datex'
})
export class DatexPipe implements PipeTransform {

  constructor(
    private dateService: DateService,
  ) {}

  transform(value: any, ... args: any[]): any {
    return this.dateService.format(value, ...args);
  }

}

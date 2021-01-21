import { Pipe, PipeTransform } from '@angular/core';

import { DateService } from '../../services/date/date.service';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  constructor(
    private dateService: DateService,
  ) {}

  transform(value: any, ... args: any[]): any {
    return this.dateService.relative(value, ...args);
  }

}

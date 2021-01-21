import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyService } from '../../services/currency/currency.service';

@Pipe({
  name: 'currencyx'
})
export class CurrencyxPipe implements PipeTransform {

  constructor(
    private currencyService: CurrencyService,
  ) {}

  transform(value: any, ... args: any[]): any {
    return this.currencyService.format(value, ...args);
  }

}

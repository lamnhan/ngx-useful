import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface CurrencyConfigs {
  currencyCode?: string;
  display?: string;
  digitsInfo?: string;
  locale?: string;
  // additional
  freeText?: string;
  converterApiKey?: string;
  estimatedExchangeRate?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private configs: CurrencyConfigs = {};
  private currencyPipe: CurrencyPipe = new CurrencyPipe('en-US');
  private exchangeRate = 1;

  constructor() {}

  async init(configs: CurrencyConfigs, locale = 'en-US') {
    // set configs
    configs.locale = configs.locale || locale || 'en-US'; // using app locale
    this.configs = configs;
    // create currency pipe instance
    this.currencyPipe = new CurrencyPipe(locale);
    // load exchange rate
    return this.loadExchangeRate();
  }

  format(
    value: any,
    currencyCode?: string,
    display?: string,
    digitsInfo?: string,
    locale?: string,
  ) {
    if (isNaN(value)) {
      return value;
    } else if (!value || value === 0) {
      return this.configs.freeText || 'Free';
    } else {
      return this.currencyPipe.transform(
        value,
        currencyCode || this.configs.currencyCode || 'USD',
        display || this.configs.display || 'symbol',
        digitsInfo || this.configs.digitsInfo || '1.0-2',
        locale || this.configs.locale || 'en-US',
      );
    }
  }

  convert(value: number) {
    const { currencyCode = 'USD' } = this.configs;
    return currencyCode === 'USD' ? value : Math.round(((value / this.exchangeRate) + 0.00001) * 100) / 100;
  }

  private async loadExchangeRate() {
    const {
      currencyCode = 'USD',
      converterApiKey,
      estimatedExchangeRate = 1,
    } = this.configs;
    if (!!converterApiKey && currencyCode !== 'USD') {
      let rate = estimatedExchangeRate || 1;
      // fetcher
      const currencyKey = 'USD_' + currencyCode;
      const url = 'https://free.currencyconverterapi.com/api/v6/convert?compact=ultra' +
        '&apiKey=' + converterApiKey +
        '&q=' + currencyKey;
      // fetch data
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        rate = result[currencyKey];
      }
      // set exchange rate
      this.exchangeRate = rate;
    }
  }
}

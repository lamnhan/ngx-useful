import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

export type RelativeTimeWords = 'seconds' | 'minutes' | 'hours' | 'days';
export type RelativeTimeTranslation = {[key in RelativeTimeWords]?: string};
export interface RelativeTimeTranslator extends RelativeTimeTranslation {
  now?: string;
  ago?: string;
  later?: string;
}

export interface DateConfigs {
  format?: string;
  timezone?: string;
  locale?: string;
  // additional
  translator?: RelativeTimeTranslator;
}

/**
 * (DON'T USE YET) Date service
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {
  private configs: DateConfigs = {};
  private datePipe: DatePipe = new DatePipe('en-US');

  constructor() {}

  async init(configs: DateConfigs, locale = 'en-US') {
    // set configs
    configs.locale = configs.locale || locale || 'en-US'; // using app locale
    this.configs = configs;
    // create date pipe instance
    this.datePipe = new DatePipe(locale);
    // done
    return this as DateService;
  }

  format(
    value: number | string | Date,
    format?: string,
    timezone?: string,
    locale?: string,
  ) {
    return this.datePipe.transform(
      value,
      format || this.configs.format || 'mediumDate',
      timezone || this.configs.timezone || '+0000',
      locale || this.configs.locale || 'en-US',
    );
  }

  relative(
    date: number | string | Date,
    formatter?: (value: number | string | Date) => string,
  ) {
    // calculate delta
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    // display text
    const {
      now: nowText = 'now',
      ago: agoText = 'ago',
      later: laterText = 'later',
      seconds: secondsText = 'seconds',
      minutes: minutesText = 'minutes',
      hours: hoursText = 'hours',
      days: daysText = 'days'
    } = this.configs.translator || {};
    // process
    if (isNaN(diff)) {
      return '';
    }
    if (diff < 0) {
      return laterText;
    }
    if (diff <= second * 3) {
      return nowText;
    }
    if (diff <= minute) {
      return Math.floor(diff / second) + ` ${secondsText} ${agoText}`;
    }
    if (diff <= hour) {
      return Math.floor(diff / minute) + ` ${minutesText} ${agoText}`;
    }
    if (diff <= day) {
      return Math.floor(diff / hour) + ` ${hoursText} ${agoText}`;
    }
    if (diff <= week) {
      return Math.floor(diff / day) + ` ${daysText} ${agoText}`;
    }
    return !!formatter ? formatter(then) : this.format(then);
  }
}

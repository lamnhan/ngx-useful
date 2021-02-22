import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';

export interface PWAOptions {
  reminder?: boolean | string;
  reminderEvery?: number;
  reminderMax?: number;
}

export type PWAStatus =
  | 'installed' // standalone or installed implicitly
  | 'available' // can be asked now
  | 'unavailable'; // already asked

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly LSK_STATUS = 'pwa_status';
  private readonly LSK_REMINDER_TIMESTAMP = 'pwa_reminder_timestamp';
  private readonly LSK_REMINDER_COUNT = 'pwa_reminder_count';

  private options: PWAOptions = {};

  private status?: PWAStatus;

  constructor(
    private localstorageService: LocalstorageService
  ) {}

  init(options: PWAOptions = {}) {
    this.options = options;
    // checking
    this.loadStatus()
      .subscribe(status => this.changeStatus(status as PWAStatus));
  }

  get IS_INSTALLED() {
    return this.status === 'installed';
  }

  get IS_AVAILABLE() {
    return this.status === 'available';
  }

  changeStatus(status: PWAStatus) {
    // handler
    if (status === 'available') {
      this.showReminder();
    }
    // in app
    this.status = status;
    // if available
    if (status === 'available') {
      this.localstorageService.set(this.LSK_REMINDER_TIMESTAMP, new Date().getTime());
      this.localstorageService.increase(this.LSK_REMINDER_COUNT);
    }
    // if installed
    if (status === 'installed') {
      this.localstorageService.set(this.LSK_STATUS, status);
    }
  }

  showReminder() {
    const elm = this.getReminderElement();
    // get ua
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      if (
        !(/crios/).test(userAgent) &&
        !(/fxios/).test(userAgent) &&
        !(/opios/).test(userAgent)
      ) {
        elm.classList.add('ios-safari', 'show');
      } else {
        elm.classList.add('ios-any', 'show');
      }
    } else if (/windows|macintosh/.test(userAgent)) {
      if (/chrome/.test(userAgent)) {
        elm.classList.add('desktop-chrome', 'show');
      } else {
        elm.classList.add('desktop-any', 'show');
      }
    }
    // close button
    const close = elm.querySelector('.close');
    if (close) {
      close.addEventListener('click', () => this.hideReminder(), {once: true});
    }
    // dismissal
    const dismiss = elm.querySelector('.dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', () => {
        this.hideReminder();
        this.dismissReminder();
      }, {once: true});
    }
  }

  hideReminder() {
    const elm = this.getReminderElement();
    elm.classList.remove('show');
  }

  dismissReminder() {
    this.changeStatus('installed');
  }
  
  private getReminderElement() {
    const id = typeof this.options.reminder === 'string'
      ? this.options.reminder
      : 'pwa-install-reminder';
    const elm = document.getElementById(id);
    if (!this.options.reminder || !elm) {
      throw new Error('No PWA installing reminder by the id #' + id);
    }
    return elm;
  }

  private loadStatus() {
    return this.localstorageService.getBulk([
      this.LSK_STATUS,
      this.LSK_REMINDER_TIMESTAMP,
      this.LSK_REMINDER_COUNT
    ])
    .pipe(
      mergeMap(([status, timestamp = 0, count = 0]) => {
        // pass down local (installed & unavailable)
        if (status && status !== 'available') {
          return of(status);
        } else {
          const {reminder, reminderEvery, reminderMax} = this.options;
          // is standalone
          const isInstalled = 
            (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
          // is available (for reminder)
          const isAvailable =
            // must have the reminder
            reminder
            // must not pass the maximum (if defined)
            && (!reminderMax || (count as number) < reminderMax)
            // must expired
            && (
              (reminderEvery ? (reminderEvery * 60000) : 43200000 /* 12 hours */)
              < (new Date().getTime() - new Date(timestamp as number).getTime())
            );
          return of(
            isInstalled ? 'installed' : isAvailable ? 'available' : 'unavailable'
          );
        }
      })
    );
  }
}

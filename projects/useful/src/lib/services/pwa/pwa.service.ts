import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';

export interface PWAOptions {
  reminderEvery?: number;
  reminderMax?: number;
  reminderAnnoying?: number;
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

  private runtime = 'desktop-any';
  private status?: PWAStatus;
  private timestamp = 0;
  private count = 0;

  constructor(
    private localstorageService: LocalstorageService
  ) {}

  init(options: PWAOptions = {}) {
    this.options = options;
    // get runtime
    this.setRuntime();
    // checking
    this.loadLocalData()
    .subscribe(({ status, timestamp, count }) => {
      this.timestamp = timestamp as number;
      this.count = count as number;
      // change
      this.changeStatus(status as PWAStatus);
    });
  }

  get RUNTIME() {
    return this.runtime;
  }

  get IS_INSTALLED() {
    return this.status === 'installed';
  }

  get IS_AVAILABLE() {
    return this.status === 'available';
  }

  get IS_REMINDER_ANNOYED() {
    return this.count >= (this.options.reminderAnnoying || 3);
  }

  changeStatus(status: PWAStatus) {
    // in app
    this.status = status;
    // if available
    if (
      status === 'available'
      || (
          status === 'unavailable'
          && this.runtime === 'android-chrome'
        )
    ) {
      this.timestamp = new Date().getTime();
      this.localstorageService.set(this.LSK_REMINDER_TIMESTAMP, this.timestamp);
      this.localstorageService.set(this.LSK_REMINDER_COUNT, ++this.count);
    }
    // if installed
    else if (status === 'installed') {
      this.localstorageService.set(this.LSK_STATUS, status);
    }
  }

  showReminder() {
    this.changeStatus('available');
  }

  hideReminder() {
    this.changeStatus('unavailable');
  }

  dismissReminder() {
    this.changeStatus('installed');
  }

  private setRuntime() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      if (
        !(/crios/).test(userAgent) &&
        !(/fxios/).test(userAgent) &&
        !(/opios/).test(userAgent)
      ) {
        this.runtime = 'ios-safari';
      } else {
        this.runtime = 'ios-any';
      }
    } else if (/android/.test(userAgent)) {
      if (
        /chrome/.test(userAgent) &&
        !(/edga/).test(userAgent)
      ) {
        this.runtime = 'android-chrome';
      } else {
        this.runtime = 'android-any';
      }
    } else if (/windows|macintosh/.test(userAgent)) {
      if (
        /chrome/.test(userAgent) &&
        !(/edg/).test(userAgent)
      ) {
        this.runtime = 'desktop-chrome';
      } else {
        this.runtime = 'desktop-any';
      }
    }
  }

  private loadLocalData() {
    return this.localstorageService.getBulk([
      this.LSK_STATUS,
      this.LSK_REMINDER_TIMESTAMP,
      this.LSK_REMINDER_COUNT
    ])
    .pipe(
      mergeMap(([status, timestamp = 0, count = 0]) => {
        const result = { status, timestamp, count };
        // check local metrics
        if (!status || status === 'available') {
          const {reminderEvery, reminderMax} = this.options;
          // is standalone
          const isInstalled = 
            (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
          // is available (for reminder)
          const isAvailable =
            // must not pass the maximum (if defined)
            (!reminderMax || (count as number) < reminderMax)
            // must expired
            && (
              (reminderEvery ? (reminderEvery * 60000) : 43200000 /* 12 hours */)
              < (new Date().getTime() - new Date(timestamp as number).getTime())
            )
            // not first time on chrome on Android
            && !(
              this.runtime === 'android-chrome'
              && (!count || count === 0)
            );
          result.status = (
            isInstalled ? 'installed' : isAvailable ? 'available' : 'unavailable'
          );
        }
        return of(result);
      })
    );
  }
}

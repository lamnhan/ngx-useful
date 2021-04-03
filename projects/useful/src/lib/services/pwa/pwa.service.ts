import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';

export interface PWAOptions {
  reminder?: boolean | number;
  reminderEvery?: number;
  reminderMax?: number;
  reminderAnnoying?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly LSK_INSTALLED = 'pwa_installed';
  private readonly LSK_REMINDER_TIMESTAMP = 'pwa_reminder_timestamp';
  private readonly LSK_REMINDER_COUNT = 'pwa_reminder_count';
  private options: PWAOptions = {};

  runtime = 'desktop-any';
  installed = true;
  reminderCount = 0;
  reminderTimestamp = 0;
  reminderShowed = false;
  reminderAnnoying = 3;

  constructor(
    private readonly localstorageService: LocalstorageService
  ) {}

  init(options: PWAOptions = {}) {
    this.options = options;
    if (this.options.reminderAnnoying) {
      this.reminderAnnoying = this.options.reminderAnnoying;
    }
    this.setRuntime();
    this.loadLocalMetrics()
    .subscribe(({ installed, reminderCount, reminderTimestamp, reminderShowed }) => {
      // installing status
      this.installed = installed;
      // reminder
      this.reminderCount = reminderCount;
      this.reminderTimestamp = reminderTimestamp;
      if (!this.installed && this.options.reminder && reminderShowed) {
        setTimeout(
          () => this.showReminder(),
          this.options.reminder === true ? 0 : (this.options.reminder * 1000)
        );
      }
    });
    // done
    return this as PwaService;
  }

  showReminder(manualShowed?: boolean) {
    if (!this.installed && this.options.reminder) {
      const isAndroidChromeFirstTime = this.runtime === 'android-chrome' && this.reminderCount === 0;
      // not the first time on Chrome on Android
      // use native propmt instead
      this.reminderShowed = !isAndroidChromeFirstTime;
      // save metrics
      if (isAndroidChromeFirstTime || !manualShowed) {
        this.reminderCount++;
        this.reminderTimestamp = new Date().getTime();
        this.localstorageService.set(this.LSK_REMINDER_COUNT, this.reminderCount);
        this.localstorageService.set(this.LSK_REMINDER_TIMESTAMP, this.reminderTimestamp);
      }
    }
  }

  hideReminder() {
    if (!this.installed && this.options.reminder) {
      this.reminderShowed = false;
    }
  }

  dismissReminder() {
    if (!this.installed && this.options.reminder) {
      this.hideReminder();
      // set installed
      this.installed = true;
      this.localstorageService.set(this.LSK_INSTALLED, this.installed);
    }
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

  private loadLocalMetrics() {
    return this.localstorageService.getBulk<[boolean, number, number, boolean]>([
      this.LSK_INSTALLED,
      this.LSK_REMINDER_COUNT,
      this.LSK_REMINDER_TIMESTAMP
    ])
    .pipe(
      switchMap(([installed, reminderCount, reminderTimestamp, reminderShowed]) => {
        installed =
        // implicit installed
          installed
          // standalone
          || (navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
        reminderCount = reminderCount || 0;
        reminderTimestamp = reminderTimestamp || 0;
        reminderShowed = reminderShowed || false;
        // is reminder available
        const {reminderEvery, reminderMax} = this.options;
        reminderShowed =
          // must not pass the maximum (if defined)
          (!reminderMax || (reminderCount as number) < reminderMax)
          // must expired
          && (
            (reminderEvery ? (reminderEvery * 60000) : 43200000 /* 12 hours */)
            < (new Date().getTime() - new Date(reminderTimestamp as number).getTime())
          );
        return of({
          installed,
          reminderCount,
          reminderTimestamp,
          reminderShowed,
        });
      })
    );
  }
}

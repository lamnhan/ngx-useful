import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public readonly onChanged = new ReplaySubject<boolean>(1);
  isOnline = true;

  redirectUrl?: string;

  constructor() {}

  setRedirectUrl(url?: string) {
    this.redirectUrl = url;
  }

  init() {
    // events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onChanged.next(true);
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onChanged.next(false);
    });
    // set initial
    this.onChanged.next(navigator.onLine);
    this.isOnline = navigator.onLine;
    // done
    return this as NetworkService;
  }
}

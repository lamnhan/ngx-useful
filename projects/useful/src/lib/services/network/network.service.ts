import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private readonly onChanged = new ReplaySubject<boolean>(1);
  isOnline = false;

  constructor() {}

  init() {
    window.addEventListener('online', () => {
      this.onChanged.next(true);
      this.isOnline = true;
    });
    window.addEventListener('offline', () => {
      this.onChanged.next(false);
      this.isOnline = false;
    });
    this.onChanged.next(navigator.onLine);
    this.isOnline = navigator.onLine;
    return this as NetworkService;
  }
}

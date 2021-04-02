import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private readonly onChanged = new ReplaySubject<boolean>(1);

  constructor() {}

  init() {
    window.addEventListener('online', () => this.onChanged.next(true));
    window.addEventListener('offline', () => this.onChanged.next(false));
    this.onChanged.next(navigator.onLine);
    return this as NetworkService;
  }
}

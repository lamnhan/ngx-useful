import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {
  constructor() { }

  handleError(error: any) {
    // do something with the exception
    console.error('[Error] ', error);
  }
}

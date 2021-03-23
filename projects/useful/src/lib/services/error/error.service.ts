import { Injectable } from '@angular/core';

import { UserService } from '../user/user.service';

export interface ErrorOptions {
  userService?: UserService;
}

export interface ErrorConfig {
  projectId: string;
  apiKey: string;
  service?: string;
  version?: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private options: ErrorOptions = {};
  private config!: ErrorConfig;

  private user?: string;
  private readonly baseAPIUrl = 'https://clouderrorreporting.googleapis.com/v1beta1/projects/';

  constructor() {}

  init(config: ErrorConfig, options: ErrorOptions = {}) {
    this.config = config;
    this.options = options;
    // watch for user
    if (this.options.userService) {
      this.options.userService
        .onUserChanged
        .subscribe(user => this.user = user ? user.uid : undefined)
    }
  }

  report(error: string | Error) {
    const {projectId, apiKey, service, version} = this.config;
    // process payload
    if (typeof error === 'string') {
      try {
        throw new Error(error);
      } catch (e) {
        error = e;
      }
    }
    const payload = {
      serviceContext: {
        service: service || 'web',
        ...(version ? { version } : undefined)
      },
      context: {
        ...(this.user ? { user: this.user } : {}),
        httpRequest: {
          userAgent: window.navigator.userAgent,
          url: window.location.href,
        },
      },
      message: (error as Error).message,
    } as Record<string, unknown>;
    // dev
    if (this.config.disabled) {
      console.error('[Error] ' + payload.message, payload);
    }
    // production
    else {
      fetch(
        this.baseAPIUrl + projectId + '/events:report?key=' + apiKey,
        {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
        }
      )
      .catch(err => false); // ignore anyway
    }
  }
}

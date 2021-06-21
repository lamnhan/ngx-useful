import { Injectable } from '@angular/core';

import { UserService } from '../user/user.service';

export interface ErrorConfig {
  projectId: string;
  apiKey: string;
  service?: string;
  version?: string;
}

export interface ErrorOptions {
  disabled?: boolean;
}

export interface ErrorIntegrations {
  userService?: UserService;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private options: ErrorOptions = {};
  private integrations: ErrorIntegrations = {};
  private config!: ErrorConfig;

  private user?: string;
  private readonly baseAPIUrl = 'https://clouderrorreporting.googleapis.com/v1beta1/projects/';

  constructor() {}

  setOptions(options: ErrorOptions) {
    this.options = options;
    return this as ErrorService;
  }
  
  setIntegrations(integrations: ErrorIntegrations) {
    this.integrations = integrations;
    return this as ErrorService;
  }

  init(config: ErrorConfig) {
    this.config = config;
    // watch for user
    if (this.integrations.userService) {
      this.integrations.userService
        .onUserChanged
        .subscribe(user => this.user = user ? user.uid : undefined)
    }
    return this as ErrorService;
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
      message: (error as Error).stack,
    } as Record<string, unknown>;
    // dev
    if (this.options.disabled) {
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

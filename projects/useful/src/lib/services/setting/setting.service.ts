import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';
import { AppService } from '../app/app.service';

export interface BuiltinSettings {}

export interface BuiltinUISettings {
  theme?: string;
}

export interface AppSettings extends BuiltinSettings, BuiltinUISettings {}

export interface SettingOptions {
  browserColor?: boolean;
  settingsLoader?: () => Observable<BuiltinSettings>,
  settingsLoaderUI?: () => Observable<BuiltinUISettings>,
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {  
  private readonly LSK_THEME = 'setting_theme';

  private options: SettingOptions = {};

  // UI intensive settings
  private theme?: string;

  // other settings
  // ...

  constructor(
    private localstorageService: LocalstorageService,
    private appService: AppService
  ) {}

  init(options: SettingOptions = {}) {
    this.options = options;

    // =======================================================
    // NOTE: Settings flow
    // + Get: Remote (auth user) -> Local storage (if enabled) -> AppService -> Apply
    // + Set: Apply -> AppService -> Local storage (if enabled) -> Remote (maybe?)
    // =======================================================
    
    const {
      settingsLoaderUI = () => of({}),
      settingsLoader = () => of({}),
    } = this.options;

    // handle UI intensive settings
    settingsLoaderUI()
    .pipe(
      mergeMap(uiSettings => this.localUISettingsLoader(uiSettings)),
      mergeMap(uiSettings => this.appUISettingsLoader(uiSettings)),
    )
    .subscribe(uiSettings => {
      const {theme} = uiSettings;
      // change theme
      if (theme) {
        this.changeTheme(theme);
      }
      // hide splash screen
      if (this.appService.HAS_SPLASHSCREEN) {
        this.appService.hideSplashScreen();
      }
    });

    settingsLoader()
    .subscribe(settings => {
      // handle settings
    });
  }

  get THEME() {
    return this.theme;
  }
  
  changeTheme(name: string) {
    // handler
    document.body.setAttribute('data-theme', name);
    // in app
    this.theme = name;
    // local
    this.localstorageService.set(this.LSK_THEME, name);
    // remote
    // ...
  }

  
  private localUISettingsLoader(uiSettings: BuiltinUISettings) {
    return of(uiSettings).pipe(
      // .theme
      mergeMap(({ theme }) =>
        // pass value down
        theme
          ? of(theme)
          // get from local
          : this.localstorageService.get<string>(this.LSK_THEME)
      ),
      mergeMap(theme =>
        of({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }
  
  private appUISettingsLoader(uiSettings: BuiltinUISettings) {
    return of(uiSettings).pipe(
      // .theme
      mergeMap(({ theme }) =>
        of(
          // pass down
          theme
            ? theme
            // default theme
            : !this.options.browserColor
              ? null
              // browser scheme colors
              : (
                window.matchMedia
                && window.matchMedia('(prefers-color-scheme: dark)').matches
              )
                ? 'dark'
                : 'light'
        )
      ),
      mergeMap(theme =>
        of({...uiSettings, theme} as BuiltinUISettings)
      ),
      // other ui settings
      // mergeMap(uiSettings => {})
    );
  }
}

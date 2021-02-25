import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LocalstorageService } from '../localstorage/localstorage.service';
import { AppService } from '../app/app.service';

export interface BuiltinUISettings {
  theme?: string;
  persona?: string;
  locale?: string;
}

export interface BuiltinGeneralSettings {}

export interface AppSettings extends BuiltinUISettings, BuiltinGeneralSettings {}

export interface SettingOptions {
  browserColor?: boolean;
  uiSettingsLoader?: () => Observable<BuiltinUISettings>,
  generalSettingsLoader?: () => Observable<BuiltinGeneralSettings>,
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {  
  private readonly LSK_THEME = 'setting_theme';
  private readonly LSK_PERSONA = 'setting_persona';
  private readonly LSK_LOCALE = 'setting_locale';

  private options: SettingOptions = {};
  private defaultSettings: AppSettings = {};

  // UI intensive settings
  private theme?: string;
  private persona?: string;
  private locale?: string;

  // other settings
  // ...

  constructor(
    private localstorageService: LocalstorageService,
    private appService: AppService
  ) {}

  init(
    options: SettingOptions = {},
    defaultSettings: AppSettings = {}
  ) {
    this.options = options;
    this.defaultSettings = {
      // defaults
      theme: 'light',
      persona: 'default',
      locale: 'en-US',
      // custom
      ...defaultSettings
    };

    // =======================================================
    // NOTE: Settings flow
    // + Get: Remote/cache (auth user) -> Local storage (if enabled) -> AppService -> Apply
    // + Set: Apply -> AppService -> Local storage (if enabled) -> Remote/cache (maybe?)
    // =======================================================
    
    const {
      uiSettingsLoader = () => of({} as BuiltinUISettings),
      // generalSettingsLoader = () => of({} as BuiltinGeneralSettings),
    } = this.options;

    // handle UI intensive settings
    uiSettingsLoader()
    .pipe(
      switchMap(uiSettings =>
        combineLatest([
          this.loadTheme(uiSettings.theme),
          this.loadPersona(uiSettings.persona),
          this.loadLocale(uiSettings.locale)
        ])
      ),
    )
    .subscribe(uiSettings => {
      const [theme, persona, locale] = uiSettings;
      // set values
      this.changeTheme(theme);
      this.changePersona(persona);
      this.changeLocale(locale);
      // hide splash screen
      if (this.appService.HAS_SPLASHSCREEN) {
        this.appService.hideSplashScreen();
      }
    });
  }

  get THEME() {
    return this.theme as string;
  }

  get PERSONA() {
    return this.persona as string;
  }

  get LOCALE() {
    return this.locale as string;
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

  changePersona(name: string) {
    this.persona = name;
    this.localstorageService.set(this.LSK_PERSONA, name);
  }

  changeLocale(value: string) {
    this.locale = value;
    this.localstorageService.set(this.LSK_LOCALE, value);
  }
  
  private loadTheme(remoteTheme?: string) {
    return remoteTheme
      ? of(remoteTheme) // remote
      // local
      : this.localstorageService
        .get<string>(this.LSK_THEME)
        .pipe(
          switchMap(theme => of(
            theme
              ? theme
              // default
              : (
                this.options.browserColor
                && (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
              )
                ? 'dark'
                : this.defaultSettings.theme as string
          ))
        );
  }

  private loadPersona(remotePersona?: string) {
    return remotePersona
      ? of(remotePersona) // remote
      : this.localstorageService
        .get<string>(this.LSK_PERSONA)
        .pipe(
          switchMap(persona => of(
            // local
            persona
              ? persona
              //default
              : this.defaultSettings.persona as string
          ))
        );
  }

  private loadLocale(remoteLocale?: string) {
    return remoteLocale
      ? of(remoteLocale) // remote
      : this.localstorageService
        .get<string>(this.LSK_LOCALE)
        .pipe(
          switchMap(locale => of(
            // local
            locale
              ? locale
              //default
              : this.defaultSettings.locale as string
          ))
        );
  }
}

import { Injectable } from '@angular/core';
import { of, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { LocalstorageService } from '../localstorage/localstorage.service';
import { AppService } from '../app/app.service';
import { UserService } from '../user/user.service';

export interface BuiltinUISettings {
  theme?: string;
  persona?: string;
  locale?: string;
}

export interface BuiltinGeneralSettings {}

export interface AppSettings extends BuiltinUISettings, BuiltinGeneralSettings {}

export interface SettingOptions {
  browserColor?: boolean;
  withAuth?: boolean;
  translateService?: TranslateService;
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
    private appService: AppService,
    private userService: UserService,
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
    // handle UI intensive settings
    this.remoteLoader()
    .pipe(
      switchMap(uiSettings =>
        combineLatest([
          this.loadLocale(uiSettings.locale),
          this.loadTheme(uiSettings.theme),
          this.loadPersona(uiSettings.persona),
        ])
      ),
    )
    .subscribe(uiSettings => {
      const [locale, theme, persona] = uiSettings;
      // set values
      this.changeLocale(locale);
      this.changeTheme(theme);
      this.changePersona(persona);
      // hide splash screen
      this.appService.hideSplashScreen();
    });
  }

  get LOCALE() {
    return this.locale as string;
  }

  get LANG() {
    return (this.locale as string).split('-').shift() as string;
  }

  get THEME() {
    return this.theme as string;
  }

  get PERSONA() {
    return this.persona as string;
  }

  changeLocale(value: string) {
    if (this.options.translateService) {
      this.options.translateService.use(this.LANG);
    }
    // set value
    this.locale = value;
    this.localstorageService.set(this.LSK_LOCALE, value);
  }

  changeTheme(name: string) {
    document.body.setAttribute('data-theme', name);
    // set value
    this.theme = name;
    this.localstorageService.set(this.LSK_THEME, name);
    // TODO: remote
  }

  changePersona(name: string) {
    this.persona = name;
    this.localstorageService.set(this.LSK_PERSONA, name);
  }

  private remoteLoader() {
    return !this.options.withAuth
      ? of({} as AppSettings)
      : this.userService.onUserReady.pipe(
        switchMap(user => of(user ? (user as AppSettings) : {})),
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
}

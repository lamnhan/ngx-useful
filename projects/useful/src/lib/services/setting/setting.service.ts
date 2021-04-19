import { Injectable, NgZone } from '@angular/core';
import { of, combineLatest, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { LocalstorageService } from '../localstorage/localstorage.service';
import { UserService } from '../user/user.service';

export interface BuiltinDataItem {
  value: string;
  text: string;
}

export interface BuiltinData {
  themes?: BuiltinDataItem[];
  personas?: BuiltinDataItem[];
  locales?: BuiltinDataItem[];
}

export interface BuiltinUISettings {
  theme?: string;
  persona?: string;
  locale?: string;
}

export interface BuiltinGeneralSettings {}

export interface AppSettings extends BuiltinUISettings, BuiltinGeneralSettings {}

export interface SettingOptions {
  browserColor?: boolean;
  browserLocale?: boolean;
  onReady?: () => void;
  personaValidator?: (persona: string, userService?: UserService) => boolean;
}

export interface SettingIntegrations {
  localstorageService?: LocalstorageService;
  translateService?: TranslocoService;
  userService?: UserService;
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private readonly LSK_THEME = 'setting_theme';
  private readonly LSK_PERSONA = 'setting_persona';
  private readonly LSK_LOCALE = 'setting_locale';
  private options: SettingOptions = {};
  private integrations: SettingIntegrations = {};


  // builtin data
  themes: BuiltinDataItem[] = [{text: 'Light', value: 'light'}];
  personas: BuiltinDataItem[] = [{text: 'Default', value: 'default'}];
  locales: BuiltinDataItem[] = [{text: 'English', value: 'en-US'}];

  // UI intensive settings
  theme = 'light';
  persona = 'default';
  locale = 'en-US';

  // other settings
  // ...

  // events
  public readonly onThemeChanged = new ReplaySubject<string>(1);
  public readonly onPersonaChanged = new ReplaySubject<string>(1);
  public readonly onLocaleChanged = new ReplaySubject<string>(1);

  constructor(private readonly zone: NgZone) {}

  init(
    options: SettingOptions = {},
    settingData: BuiltinData = {},
    integrations: SettingIntegrations = {},
  ) {
    this.options = options;
    // data
    const {themes, personas, locales} = settingData;
    if (themes) {
      this.themes = themes;
    }
    if (personas) {
      this.personas = personas;
    }
    if (locales) {
      this.locales = locales;
    }
    // integrations
    this.integrations = integrations;
    // emit default values
    this.onThemeChanged.next(this.theme);
    this.onPersonaChanged.next(this.persona);
    this.onLocaleChanged.next(this.locale);
    // handle UI intensive settings
    this.remoteLoader()
    .pipe(
      switchMap(uiSettings =>
        combineLatest([
          this.loadTheme(uiSettings.theme),
          this.loadPersona(uiSettings.persona),
          this.loadLocale(uiSettings.locale),
        ])
      ),
    )
    .subscribe(uiSettings => this.zone.run(() => {
      const [theme, persona, locale] = uiSettings;
      // set values
      this.changeTheme(theme);
      this.changePersona(persona);
      this.changeLocale(locale);
      // trigger ready
      if (this.options.onReady) {
        this.options.onReady();
      }
    }));
    // done
    return this as SettingService;
  }

  changeTheme(name: string) {
    if (this.theme !== name) {
      // affect
      document.body.setAttribute('data-theme', name);
      // set value
      this.theme = name;
      if (this.integrations.localstorageService) {
        this.integrations.localstorageService.set(this.LSK_THEME, name);
      }
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.theme !== name
      ) {
        this.integrations.userService.updateSettings({ theme: name });
      }
      // event
      this.onThemeChanged.next(name);
    }
  }

  changePersona(name: string) {
    const isValid = !this.options.personaValidator
      ? true
      : this.options.personaValidator(name, this.integrations.userService);
    name = isValid ? name : 'default';
    if (this.persona !== name) {
      // set value
      this.persona = name;
      if (this.integrations.localstorageService) {
        this.integrations.localstorageService.set(this.LSK_PERSONA, name);
      }
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.persona !== name
      ) {
        this.integrations.userService.updateSettings({ persona: name });
      }
      // event
      this.onPersonaChanged.next(name);
    }
  }

  changeLocale(value: string) {
    if (this.locale !== value) {
      // affect
      if (this.integrations.translateService) {
        this.integrations.translateService.setActiveLang(value);
      }
      // set value
      this.locale = value;
      if (this.integrations.localstorageService) {
        this.integrations.localstorageService.set(this.LSK_LOCALE, value);
      }
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.locale !== value
      ) {
        this.integrations.userService.updateSettings({ locale: value });
      }
      // event
      this.onLocaleChanged.next(value);
    }
  }

  private remoteLoader() {
    return !this.integrations.userService
      ? of({} as AppSettings)
      : this.integrations.userService.onUserChanged.pipe(
        switchMap(data => of(data?.settings ? data.settings : {})),
      );
  }

  private loadTheme(remoteTheme?: string) {
    return remoteTheme
      // remote
      ? of(remoteTheme)
      // local
      : !this.integrations.localstorageService
        ? of('light')
        : this.integrations.localstorageService
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
                  : 'light'
            ))
          );
  }

  private loadPersona(remotePersona?: string) {
    return remotePersona
      // remote
      ? of(remotePersona)
      // local
      : !this.integrations.localstorageService
        ? of('default')
        : this.integrations.localstorageService
          .get<string>(this.LSK_PERSONA)
          .pipe(
            switchMap(persona => of(persona ? persona : 'default'))
          );
  }
  
  private loadLocale(remoteLocale?: string) {
    return remoteLocale
      // remote
      ? of(remoteLocale)
      // locale
      : !this.integrations.localstorageService
        ? of('en-US')
        : this.integrations.localstorageService
          .get<string>(this.LSK_LOCALE)
          .pipe(
            switchMap(locale => of(
              locale
                ? locale
                : (this.options.browserLocale && navigator.language.indexOf('-') !== -1)
                  ? navigator.language
                  : 'en-US'
            ))
          );
  }
}

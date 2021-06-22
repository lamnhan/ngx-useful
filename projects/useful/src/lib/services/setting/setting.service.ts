import { Injectable, NgZone } from '@angular/core';
import { of, combineLatest, ReplaySubject } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

import { LocalstorageService } from '../localstorage/localstorage.service';
import { UserService } from '../user/user.service';

export interface BuiltinListingItem {
  value: string;
  text: string;
}

export interface BuiltinListing {
  themes?: BuiltinListingItem[];
  personas?: BuiltinListingItem[];
  locales?: BuiltinListingItem[];
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
  waitForNavigationEnd?: boolean;
  usePrioritized?: boolean;
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

  // initializer
  private settingInitilizer = new ReplaySubject(1);
  isInitialized = false;

  // builtin data
  themes: BuiltinListingItem[] = [{text: 'Light', value: 'light'}];
  personas: BuiltinListingItem[] = [{text: 'Default', value: 'default'}];
  locales: BuiltinListingItem[] = [{text: 'English', value: 'en-US'}];

  // UI intensive settings
  private inititalTheme?: string;
  private prioritizedTheme?: string;
  theme = 'light';
  private inititalPersona?: string;
  private prioritizedPersona?: string;
  persona = 'default';
  private inititalLocale?: string;
  private prioritizedLocale?: string;
  locale = 'en-US';

  // other settings
  // ...

  // events
  public readonly onThemeChanged = new ReplaySubject<string>(1);
  public readonly onPersonaChanged = new ReplaySubject<string>(1);
  public readonly onLocaleChanged = new ReplaySubject<string>(1);

  constructor(private readonly zone: NgZone) {}

  setOptions(options: SettingOptions) {
    this.options = options;
    return this as SettingService;
  }
  
  setIntegrations(integrations: SettingIntegrations) {
    this.integrations = integrations;
    return this as SettingService;
  }

  setListing(listing: BuiltinListing) {
    const {themes, personas, locales} = listing;
    if (themes) {
      this.themes = themes;
    }
    if (personas) {
      this.personas = personas;
    }
    if (locales) {
      this.locales = locales;
    }
    return this as SettingService;
  }

  init() {
    // handle UI intensive settings
    combineLatest([
      this.initLoader(),
      this.remoteLoader(),
    ]).pipe(
      switchMap(([
        {theme: remoteTheme, persona: remotePersona, locale: remoteLocale},
        {theme: initTheme, persona: initPersona, locale: initLocale},
      ]) =>
        combineLatest([
          this.loadTheme({remoteTheme, initTheme}),
          this.loadPersona({remotePersona, initPersona}),
          this.loadLocale({remoteLocale, initLocale}),
        ])
      ),
    )
    .subscribe(uiSettings => this.zone.run(() => {
      const [theme, persona, locale] = uiSettings;
      // set values
      this.changeTheme(theme);
      this.changePersona(persona);
      this.changeLocale(locale);
      // set status
      this.isInitialized = true;
      // trigger ready
      if (this.options.onReady) {
        this.options.onReady();
      }
    }));
    // emit default values
    this.onThemeChanged.next(this.theme);
    this.onPersonaChanged.next(this.persona);
    this.onLocaleChanged.next(this.locale);
    // done
    return this as SettingService;
  }

  // for nav service navigation end only
  triggerSettingInitilizer() {
    this.settingInitilizer.next();
  }

  setInitialTheme(theme: string) {
    this.inititalTheme = theme;
  }

  setPrioritizedTheme(theme: string) {
    this.prioritizedTheme = theme;
  }

  setInitialPersona(persona: string) {
    this.inititalPersona = persona;
  }

  setPrioritizedPersona(persona: string) {
    this.prioritizedPersona = persona;
  }

  setInitialLocale(locale: string) {
    this.inititalLocale = locale;
  }

  setPrioritizedLocale(locale: string) {
    this.prioritizedLocale = locale;
  }

  changeTheme(name: string) {
    if (this.theme !== name) {
      // affect
      document.body.setAttribute('data-theme', name);
      // set remote
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.theme !== name
      ) {
        this.integrations.userService.updateSettings({ theme: name });
      }
      // event
      this.onThemeChanged.next(name);
    }
    // set value
    this.theme = name;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_THEME, name);
    }
  }

  changePersona(name: string) {
    const isValid = !this.options.personaValidator
      ? true
      : this.options.personaValidator(name, this.integrations.userService);
    name = isValid ? name : 'default';
    if (this.persona !== name) {
      // set remote
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.persona !== name
      ) {
        this.integrations.userService.updateSettings({ persona: name });
      }
      // event
      this.onPersonaChanged.next(name);
    }
    // set value
    this.persona = name;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_PERSONA, name);
    }
  }

  changeLocale(value: string) {
    if (this.locale !== value) {
      // affect
      if (this.integrations.translateService) {
        this.integrations.translateService.setActiveLang(value);
      }
      // set remote
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.locale !== value
      ) {
        this.integrations.userService.updateSettings({ locale: value });
      }
      // event
      this.onLocaleChanged.next(value);
    }
    // set value
    this.locale = value;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_LOCALE, value);
    }
  }

  private initLoader() {
    return !this.options.waitForNavigationEnd
      ? of({} as AppSettings)
      : this.settingInitilizer.pipe(
        take(1),
        map(() => ({
          ...(this.inititalTheme ? {}: {theme: this.inititalTheme}),
          ...(this.inititalPersona ? {}: {persona: this.inititalPersona}),
          ...(this.inititalLocale ? {}: {locale: this.inititalLocale}),
        })),
      );
  }

  private remoteLoader() {
    return !this.integrations.userService
      ? of({} as AppSettings)
      : this.integrations.userService.onUserChanged.pipe(
        take(1),
        switchMap(data => of(data?.settings ? data.settings : {})),
      );
  }

  private loadTheme({remoteTheme, initTheme}: {remoteTheme?: string; initTheme?: string} = {}) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedTheme)
      // 2. remote
      ? this.prioritizedTheme 
      : remoteTheme
        ? of(remoteTheme)
        // 3. local
        : !this.integrations.localstorageService
          ? of(initTheme || 'light')
          : this.integrations.localstorageService
            .get<string>(this.LSK_THEME)
            .pipe(
              switchMap(theme => of(
                theme
                  ? theme
                  // 4. from initial
                  : initTheme
                    ? initTheme
                    // 5. from client
                    : (
                      this.options.browserColor
                      && (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                    )
                      ? 'dark'
                      // 6. default
                      : 'light'
              ))
            );
  }

  private loadPersona({remotePersona, initPersona}: {remotePersona?: string; initPersona?: string} = {}) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedPersona)
      // 2. remote
      ? this.prioritizedPersona 
      : remotePersona
        ? of(remotePersona)
        // 3. local
        : !this.integrations.localstorageService
          ? of(initPersona || 'default')
          : this.integrations.localstorageService
            .get<string>(this.LSK_PERSONA)
            .pipe(
              switchMap(persona => of(
                persona
                  ? persona
                  // 4. from initial
                  : initPersona
                    ? initPersona
                    // 5. default
                    : 'default'
              ))
            );
  }
  
  private loadLocale({remoteLocale, initLocale}: {remoteLocale?: string; initLocale?: string} = {}) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedLocale)
      ? this.prioritizedLocale
      // 2. remote
      : remoteLocale
        ? of(remoteLocale)
        // 3. locale
        : !this.integrations.localstorageService
          ? of(initLocale || 'en-US')
          : this.integrations.localstorageService
            .get<string>(this.LSK_LOCALE)
            .pipe(
              switchMap(locale => of(
                locale
                  ? locale
                  // 4. from initial
                  : initLocale
                    ? initLocale
                    // 5. from client
                    : (this.options.browserLocale && navigator.language.indexOf('-') !== -1)
                      ? navigator.language
                      // 6. default
                      : 'en-US'
              ))
            );
  }
}

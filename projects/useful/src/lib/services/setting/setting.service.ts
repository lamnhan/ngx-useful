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
  private onThemeChangedAnyEmitted = false;
  public readonly onPersonaChanged = new ReplaySubject<string>(1);
  private onPersonaChangedAnyEmitted = false;
  public readonly onLocaleChanged = new ReplaySubject<string>(1);
  private onLocaleChangedAnyEmitted = false;

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

  setDefaults(defaultSettings: AppSettings) {
    const {theme, persona, locale} = defaultSettings;
    if (theme) {
      this.theme = theme;
    }
    if (persona) {
      this.persona = persona;
    }
    if (locale) {
      this.locale = locale;
    }
    return this as SettingService;
  }

  init() {
    // handle UI intensive settings
    combineLatest([
      this.remoteLoader(),
      this.initLoader(),
    ]).pipe(
      switchMap(([{theme: remoteTheme, persona: remotePersona, locale: remoteLocale}]) =>
        combineLatest([
          this.loadTheme(remoteTheme),
          this.loadPersona(remotePersona),
          this.loadLocale(remoteLocale),
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
      // set status
      this.isInitialized = true;
    }));
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
    // value changed only
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
    }
    // set value
    this.theme = name;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_THEME, name);
    }    
    // emit event
    if (this.theme !== name || !this.onThemeChangedAnyEmitted) {
      this.onThemeChangedAnyEmitted = true;
      this.onThemeChanged.next(name);
    }
  }

  changePersona(name: string) {
    // check validation
    const isValid = !this.options.personaValidator
      ? true
      : this.options.personaValidator(name, this.integrations.userService);
    name = isValid ? name : 'default';
    // value changed only
    if (this.persona !== name) {
      // set remote
      if (
        this.integrations.userService?.currentUser
        && this.integrations.userService.data?.settings?.persona !== name
      ) {
        this.integrations.userService.updateSettings({ persona: name });
      }
    }
    // set value
    this.persona = name;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_PERSONA, name);
    }
    // emit event
    if (this.persona !== name || !this.onPersonaChangedAnyEmitted) {
      this.onPersonaChangedAnyEmitted = true;
      this.onPersonaChanged.next(name);
    }
  }

  changeLocale(value: string) {
    // value changed only
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
    }
    // set value
    this.locale = value;
    if (this.integrations.localstorageService) {
      this.integrations.localstorageService.set(this.LSK_LOCALE, value);
    }
    // emit event
    if (this.locale !== value || !this.onLocaleChangedAnyEmitted) {
      this.onLocaleChangedAnyEmitted = true;
      this.onLocaleChanged.next(value);
    }
  }

  private initLoader() {
    return !this.options.waitForNavigationEnd
      ? of({} as AppSettings)
      : this.settingInitilizer;
  }

  private remoteLoader() {
    return !this.integrations.userService
      ? of({} as AppSettings)
      : this.integrations.userService.onUserChanged.pipe(
        take(1),
        switchMap(data => of(data?.settings ? data.settings : {})),
      );
  }

  private loadTheme(remoteTheme?: string) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedTheme)
      // 2. remote
      ? of(this.prioritizedTheme)
      : remoteTheme
        ? of(remoteTheme)
        // 3. local
        : !this.integrations.localstorageService
          ? of(this.inititalTheme || 'light')
          : this.integrations.localstorageService
            .get<string>(this.LSK_THEME)
            .pipe(
              switchMap(theme => of(
                theme
                  ? theme
                  // 4. from initial
                  : this.inititalTheme
                    ? this.inititalTheme
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

  private loadPersona(remotePersona?: string) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedPersona)
      // 2. remote
      ? of(this.prioritizedPersona) 
      : remotePersona
        ? of(remotePersona)
        // 3. local
        : !this.integrations.localstorageService
          ? of(this.inititalPersona || 'default')
          : this.integrations.localstorageService
            .get<string>(this.LSK_PERSONA)
            .pipe(
              switchMap(persona => of(
                persona
                  ? persona
                  // 4. from initial
                  : this.inititalPersona
                    ? this.inititalPersona
                    // 5. default
                    : 'default'
              ))
            );
  }
  
  private loadLocale(remoteLocale?: string) {
    // 1. prioritize
    return (this.options.usePrioritized && this.prioritizedLocale)
      ? of(this.prioritizedLocale)
      // 2. remote
      : remoteLocale
        ? of(remoteLocale)
        // 3. locale
        : !this.integrations.localstorageService
          ? of(this.inititalLocale || 'en-US')
          : this.integrations.localstorageService
            .get<string>(this.LSK_LOCALE)
            .pipe(
              switchMap(locale => of(
                locale
                  ? locale
                  // 4. from initial
                  : this.inititalLocale
                    ? this.inititalLocale
                    // 5. from client
                    : (this.options.browserLocale && navigator.language.indexOf('-') !== -1)
                      ? navigator.language
                      // 6. default
                      : 'en-US'
              ))
            );
  }
}

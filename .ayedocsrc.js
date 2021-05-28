module.exports = {
  url: 'https://ngx-useful.lamnhan.com',
  srcPath: './projects/useful/src',
  webRender: {
    out: 'docs/content',
  },
  fileRender: {
    // services
    'docs/content/services/app.md': {main: ['AppService', 'FULL']},
    'docs/content/services/auth.md': {main: ['AuthService', 'FULL']},
    'docs/content/services/cache.md': {main: ['CacheService', 'FULL']},
    'docs/content/services/database.md': {main: ['DatabaseService', 'FULL']},
    'docs/content/services/error.md': {main: ['ErrorService', 'FULL']},
    'docs/content/services/fetch.md': {main: ['FetchService', 'FULL']},
    'docs/content/services/helper.md': {main: ['HelperService', 'FULL']},
    'docs/content/services/localstorage.md': {main: ['LocalstorageService', 'FULL']},
    'docs/content/services/meta.md': {main: ['MetaService', 'FULL']},
    'docs/content/services/nav.md': {main: ['NavService', 'FULL']},
    'docs/content/services/persona.md': {main: ['PersonaService', 'FULL']},
    'docs/content/services/pwa.md': {main: ['PwaService', 'FULL']},
    'docs/content/services/setting.md': {main: ['SettingService', 'FULL']},
    'docs/content/services/user.md': {main: ['UserService', 'FULL']},
    // pipes
    'docs/content/pipes/o1i.md': {main: ['O1iPipe', 'SELF']},
    'docs/content/pipes/o2a.md': {main: ['O2aPipe', 'SELF']},
    'docs/content/pipes/safe.md': {main: ['SafePipe', 'SELF']},
    // directives
    'docs/content/directives/router-link.md': {main: ['RouterLinkDirective', 'SELF']},
    // guards
    'docs/content/guards/auth.md': {main: ['AuthGuard', 'SELF']},
  }
};

module.exports = {
  url: 'https://ngx-useful.lamnhan.com/content/reference',
  srcPath: './projects/useful/src',
  cleanOutput: true,
  webRender: {
    out: 'docs/content',
  },
  fileRender: {
    'README.md': {
      cleanOutput: false,
      template: 'angularx'
    },
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
    'docs/content/pipes/o1i.md': {main: ['O1iPipe', 'FULL']},
    'docs/content/pipes/o2a.md': {main: ['O2aPipe', 'FULL']},
    'docs/content/pipes/safe.md': {main: ['SafePipe', 'FULL']},
    // directives
    'docs/content/directives/router-link.md': {main: ['RouterLinkDirective', 'FULL']},
    // guards
    'docs/content/guards/auth.md': {main: ['AuthGuard', 'FULL']},
  }
};

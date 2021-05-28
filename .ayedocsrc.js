module.exports = {
  url: 'https://ngx-useful.lamnhan.com',
  srcPath: './projects/useful/src',
  webRender: {
    out: 'docs/content',
  },
  fileRender: {
    'docs/content/services/app.md': {app: ['AppService', 'FULL']},
    'docs/content/services/meta.md': {meta: ['MetaService', 'FULL']},
    'docs/content/services/nav.md': {nav: ['NavService', 'FULL']},
  }
};

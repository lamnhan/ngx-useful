import { NgModule, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule, MarkdownService, SECURITY_CONTEXT } from 'ngx-markdown';
import { RouterLinkDirectiveModule } from '../../directives/router-link/router-link.module';

import 'prismjs';
import 'prismjs/components/prism-css.min.js';
import 'prismjs/components/prism-scss.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-typescript.min.js';
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-markdown.min.js';
import 'prismjs/components/prism-json.min.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
// import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js';
// import 'emoji-toolkit/lib/js/joypixels.min.js';

import { ContentComponent } from './content.component';

@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    MarkdownModule,
    RouterLinkDirectiveModule,
  ],
  providers: [
    MarkdownService,
    {
      provide: SECURITY_CONTEXT,
      useValue: SecurityContext.HTML
    },
  ],
  exports: [ContentComponent]
})
export class ContentComponentModule {}

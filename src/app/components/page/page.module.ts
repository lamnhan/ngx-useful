import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { MenuComponentModule } from '../menu/menu.module';
import { ContentComponentModule } from '../content/content.module';

import { PageComponent } from './page.component';

@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    MenuComponentModule,
    ContentComponentModule,
    RouterLinkDirectiveModule,
  ],
  exports: [PageComponent]
})
export class PageComponentModule {}

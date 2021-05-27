import { NgModule } from '@angular/core';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    RouterLinkDirectiveModule,
  ],
  exports: [HeaderComponent]
})
export class HeaderComponentModule { }

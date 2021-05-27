import { NgModule } from '@angular/core';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { Header2ndComponent } from './header2nd.component';

@NgModule({
  declarations: [Header2ndComponent],
  imports: [
    RouterLinkDirectiveModule,
  ],
  exports: [Header2ndComponent]
})
export class Header2ndComponentModule { }

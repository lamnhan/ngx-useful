import { NgModule } from '@angular/core';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { FooterComponent } from './footer.component';

@NgModule({
  declarations: [FooterComponent],
  imports: [
    RouterLinkDirectiveModule,
  ],
  exports: [FooterComponent]
})
export class FooterComponentModule { }

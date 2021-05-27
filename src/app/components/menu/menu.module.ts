import { NgModule } from '@angular/core';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    RouterLinkDirectiveModule,
  ],
  exports: [MenuComponent]
})
export class MenuComponentModule { }

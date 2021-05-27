import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { MenuComponent } from './menu.component';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
  ],
  exports: [MenuComponent]
})
export class MenuComponentModule { }

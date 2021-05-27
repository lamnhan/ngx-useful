import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { OopsRoutingModule } from './oops-routing.module';
import { OopsComponent } from './oops.component';


@NgModule({
  declarations: [
    OopsComponent
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    OopsRoutingModule
  ]
})
export class OopsPageModule {}

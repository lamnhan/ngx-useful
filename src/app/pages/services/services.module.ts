import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { PageComponentModule } from '../../components/page/page.module';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';

@NgModule({
  declarations: [
    ServicesComponent
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    PageComponentModule,
    ServicesRoutingModule
  ]
})
export class ServicesPageModule {}

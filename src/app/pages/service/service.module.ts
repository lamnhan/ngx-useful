import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';

@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    ServiceRoutingModule
  ]
})
export class ServicePageModule {}

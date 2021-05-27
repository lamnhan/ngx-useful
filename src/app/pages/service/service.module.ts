import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';

@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    ServiceRoutingModule
  ]
})
export class ServicePageModule {}

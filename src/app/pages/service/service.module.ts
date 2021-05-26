import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';


@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    CommonModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }

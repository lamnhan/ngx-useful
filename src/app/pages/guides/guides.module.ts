import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';


@NgModule({
  declarations: [
    GuidesComponent
  ],
  imports: [
    CommonModule,
    GuidesRoutingModule
  ]
})
export class GuidesModule { }

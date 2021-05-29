import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';


@NgModule({
  declarations: [
    GuidesComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    GuidesRoutingModule
  ]
})
export class GuidesPageModule {}

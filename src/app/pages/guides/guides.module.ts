import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { GuidesRoutingModule } from './guides-routing.module';
import { GuidesComponent } from './guides.component';


@NgModule({
  declarations: [
    GuidesComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    GuidesRoutingModule
  ]
})
export class GuidesPageModule {}

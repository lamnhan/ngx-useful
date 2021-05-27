import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { DirectivesRoutingModule } from './directives-routing.module';
import { DirectivesComponent } from './directives.component';


@NgModule({
  declarations: [
    DirectivesComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    DirectivesRoutingModule
  ]
})
export class DirectivesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { DirectivesRoutingModule } from './directives-routing.module';
import { DirectivesComponent } from './directives.component';


@NgModule({
  declarations: [
    DirectivesComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    DirectivesRoutingModule
  ]
})
export class DirectivesPageModule {}

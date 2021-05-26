import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesRoutingModule } from './directives-routing.module';
import { DirectivesComponent } from './directives.component';


@NgModule({
  declarations: [
    DirectivesComponent
  ],
  imports: [
    CommonModule,
    DirectivesRoutingModule
  ]
})
export class DirectivesModule { }

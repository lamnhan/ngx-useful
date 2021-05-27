import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuardsRoutingModule } from './guards-routing.module';
import { GuardsComponent } from './guards.component';


@NgModule({
  declarations: [
    GuardsComponent
  ],
  imports: [
    CommonModule,
    GuardsRoutingModule
  ]
})
export class GuardsPageModule {}

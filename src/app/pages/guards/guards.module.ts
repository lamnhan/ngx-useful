import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { GuardsRoutingModule } from './guards-routing.module';
import { GuardsComponent } from './guards.component';


@NgModule({
  declarations: [
    GuardsComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    GuardsRoutingModule
  ]
})
export class GuardsPageModule {}

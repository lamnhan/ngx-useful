import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { GuardsRoutingModule } from './guards-routing.module';
import { GuardsComponent } from './guards.component';


@NgModule({
  declarations: [
    GuardsComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    GuardsRoutingModule
  ]
})
export class GuardsPageModule {}

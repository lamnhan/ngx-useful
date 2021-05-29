import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { PipesRoutingModule } from './pipes-routing.module';
import { PipesComponent } from './pipes.component';


@NgModule({
  declarations: [
    PipesComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    PipesRoutingModule
  ]
})
export class PipesPageModule {}

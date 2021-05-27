import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { PipesRoutingModule } from './pipes-routing.module';
import { PipesComponent } from './pipes.component';


@NgModule({
  declarations: [
    PipesComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    PipesRoutingModule
  ]
})
export class PipesPageModule {}

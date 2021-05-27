import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { PipeRoutingModule } from './pipe-routing.module';
import { PipeComponent } from './pipe.component';


@NgModule({
  declarations: [
    PipeComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    PipeRoutingModule
  ]
})
export class PipePageModule {}

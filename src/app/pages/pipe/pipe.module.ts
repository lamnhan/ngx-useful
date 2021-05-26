import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipeRoutingModule } from './pipe-routing.module';
import { PipeComponent } from './pipe.component';


@NgModule({
  declarations: [
    PipeComponent
  ],
  imports: [
    CommonModule,
    PipeRoutingModule
  ]
})
export class PipeModule { }

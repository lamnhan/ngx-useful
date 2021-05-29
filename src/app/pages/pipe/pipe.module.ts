import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { PipeRoutingModule } from './pipe-routing.module';
import { PipeComponent } from './pipe.component';


@NgModule({
  declarations: [
    PipeComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    PipeRoutingModule
  ]
})
export class PipePageModule {}

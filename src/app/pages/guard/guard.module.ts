import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { GuardRoutingModule } from './guard-routing.module';
import { GuardComponent } from './guard.component';


@NgModule({
  declarations: [
    GuardComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    GuardRoutingModule
  ]
})
export class GuardPageModule {}

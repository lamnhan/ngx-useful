import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { GuardRoutingModule } from './guard-routing.module';
import { GuardComponent } from './guard.component';


@NgModule({
  declarations: [
    GuardComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    GuardRoutingModule
  ]
})
export class GuardPageModule {}

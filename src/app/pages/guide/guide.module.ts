import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { GuideRoutingModule } from './guide-routing.module';
import { GuideComponent } from './guide.component';


@NgModule({
  declarations: [
    GuideComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    GuideRoutingModule
  ]
})
export class GuidePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { GuideRoutingModule } from './guide-routing.module';
import { GuideComponent } from './guide.component';


@NgModule({
  declarations: [
    GuideComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    GuideRoutingModule
  ]
})
export class GuidePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentComponentModule } from '../../components/content/content.module';

import { DirectiveRoutingModule } from './directive-routing.module';
import { DirectiveComponent } from './directive.component';


@NgModule({
  declarations: [
    DirectiveComponent
  ],
  imports: [
    CommonModule,
    ContentComponentModule,
    DirectiveRoutingModule
  ]
})
export class DirectivePageModule {}

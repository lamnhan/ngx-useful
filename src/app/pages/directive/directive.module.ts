import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageComponentModule } from '../../components/page/page.module';

import { DirectiveRoutingModule } from './directive-routing.module';
import { DirectiveComponent } from './directive.component';


@NgModule({
  declarations: [
    DirectiveComponent
  ],
  imports: [
    CommonModule,
    PageComponentModule,
    DirectiveRoutingModule
  ]
})
export class DirectivePageModule {}

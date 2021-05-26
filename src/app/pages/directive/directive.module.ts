import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectiveRoutingModule } from './directive-routing.module';
import { DirectiveComponent } from './directive.component';


@NgModule({
  declarations: [
    DirectiveComponent
  ],
  imports: [
    CommonModule,
    DirectiveRoutingModule
  ]
})
export class DirectiveModule { }

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { SafePipeModule } from '../../pipes/safe/safe.module';
import {IconComponent} from './icon.component';

@NgModule({
  declarations: [
    IconComponent,
  ],
  imports: [
    CommonModule,
    SafePipeModule
  ],
  exports: [
    IconComponent,
  ]
})
export class IconComponentModule { }

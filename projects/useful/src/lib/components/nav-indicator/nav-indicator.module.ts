import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {NavIndicatorComponent} from './nav-indicator.component';

@NgModule({
  declarations: [
    NavIndicatorComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavIndicatorComponent,
  ]
})
export class NavIndicatorComponentModule {}

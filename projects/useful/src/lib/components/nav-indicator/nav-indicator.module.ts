import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {NavIndicatorComponent} from './nav-indicator.component';

@NgModule({
  declarations: [
    NavIndicatorComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    NavIndicatorComponent,
  ]
})
export class NavIndicatorComponentModule {}

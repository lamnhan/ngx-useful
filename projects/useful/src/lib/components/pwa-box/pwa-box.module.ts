import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {PwaBoxComponent} from './pwa-box.component';

@NgModule({
  declarations: [
    PwaBoxComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    PwaBoxComponent,
  ]
})
export class PwaBoxComponentModule {}

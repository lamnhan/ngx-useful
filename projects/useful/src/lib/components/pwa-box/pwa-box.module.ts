import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {PwaBoxComponent} from './pwa-box.component';

@NgModule({
  declarations: [
    PwaBoxComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PwaBoxComponent,
  ]
})
export class PwaBoxComponentModule {}

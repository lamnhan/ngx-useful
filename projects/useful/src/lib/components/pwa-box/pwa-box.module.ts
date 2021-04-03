import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import {PwaBoxComponent} from './pwa-box.component';

@NgModule({
  declarations: [
    PwaBoxComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
  ],
  exports: [
    PwaBoxComponent,
  ]
})
export class PwaBoxComponentModule {}

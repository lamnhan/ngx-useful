import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import {PwaReminderComponent} from './pwa-reminder.component';

@NgModule({
  declarations: [
    PwaReminderComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
  ],
  exports: [
    PwaReminderComponent,
  ]
})
export class PwaReminderComponentModule {}

import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {PwaReminderComponent} from './pwa-reminder.component';

@NgModule({
  declarations: [
    PwaReminderComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    PwaReminderComponent,
  ]
})
export class PwaReminderComponentModule {}

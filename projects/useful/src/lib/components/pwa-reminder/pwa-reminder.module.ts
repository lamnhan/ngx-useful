import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {PwaReminderComponent} from './pwa-reminder.component';

@NgModule({
  declarations: [
    PwaReminderComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    PwaReminderComponent,
  ]
})
export class PwaReminderComponentModule {}

import { NgModule } from '@angular/core';

import { OauthPopupComponentModule } from './components/oauth-popup/oauth-popup.module';

import { O2aPipeModule } from './pipes/o2a/o2a.module';
import { FilterPipeModule } from './pipes/filter/filter.module';
import { SafePipeModule } from './pipes/safe/safe.module';
import { CurrencyxPipeModule } from './pipes/currencyx/currencyx.module';
import { DatexPipeModule } from './pipes/datex/datex.module';
import { AgoPipeModule } from './pipes/ago/ago.module';
import { ListPipeModule } from './pipes/list/list.module';

@NgModule({
  declarations: [],
  imports: [
    OauthPopupComponentModule,
    O2aPipeModule,
    FilterPipeModule,
    SafePipeModule,
    CurrencyxPipeModule,
    DatexPipeModule,
    AgoPipeModule,
    ListPipeModule,
  ],
  exports: [
    OauthPopupComponentModule,
    O2aPipeModule,
    FilterPipeModule,
    SafePipeModule,
    CurrencyxPipeModule,
    DatexPipeModule,
    AgoPipeModule,
    ListPipeModule,
  ]
})
export class UsefulModule { }

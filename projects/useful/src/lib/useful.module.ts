import { NgModule } from '@angular/core';

import { OauthPopupComponentModule } from './components/oauth-popup/oauth-popup.module';
import { NavIndicatorComponentModule } from './components/nav-indicator/nav-indicator.module';
import { PwaReminderComponentModule } from './components/pwa-reminder/pwa-reminder.module';
import { PwaBoxComponentModule } from './components/pwa-box/pwa-box.module';

import { O2aPipeModule } from './pipes/o2a/o2a.module';
import { FilterPipeModule } from './pipes/filter/filter.module';
import { SafePipeModule } from './pipes/safe/safe.module';
import { CurrencyxPipeModule } from './pipes/currencyx/currencyx.module';
import { DatexPipeModule } from './pipes/datex/datex.module';
import { AgoPipeModule } from './pipes/ago/ago.module';
import { ListPipeModule } from './pipes/list/list.module';

import {HelperService} from './services/helper/helper.service';
import {LocalstorageService} from './services/localstorage/localstorage.service';
import {CacheService} from './services/cache/cache.service';
import {FetchService} from './services/fetch/fetch.service';
import {MetaService} from './services/meta/meta.service';
import {AppService} from './services/app/app.service';
import {NavService} from './services/nav/nav.service';
import {SettingService} from './services/setting/setting.service';
import {PwaService} from './services/pwa/pwa.service';
import {DateService} from './services/date/date.service';
import {CurrencyService} from './services/currency/currency.service';
import {NotifyService} from './services/notify/notify.service';
import {CartService} from './services/cart/cart.service';
import {PlayerService} from './services/player/player.service';

@NgModule({
  declarations: [],
  imports: [
    OauthPopupComponentModule,
    NavIndicatorComponentModule,
    PwaReminderComponentModule,
    PwaBoxComponentModule,
    O2aPipeModule,
    FilterPipeModule,
    SafePipeModule,
    CurrencyxPipeModule,
    DatexPipeModule,
    AgoPipeModule,
    ListPipeModule,
  ],
  providers: [
    HelperService,
    LocalstorageService,
    CacheService,
    FetchService,
    MetaService,
    AppService,
    NavService,
    SettingService,
    PwaService,
    DateService,
    CurrencyService,
    NotifyService,
    CartService,
    PlayerService,
  ],
  exports: [
    OauthPopupComponentModule,
    NavIndicatorComponentModule,
    PwaReminderComponentModule,
    PwaBoxComponentModule,
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

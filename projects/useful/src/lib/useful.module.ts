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

import { RouterLinkDirectiveModule } from './directives/router-link/router-link.module';

import {HelperService} from './services/helper/helper.service';
import {ErrorService} from './services/error/error.service';
import {NetworkService} from './services/network/network.service';
import {LocalstorageService} from './services/localstorage/localstorage.service';
import {CacheService} from './services/cache/cache.service';
import {FetchService} from './services/fetch/fetch.service';
import {MetaService} from './services/meta/meta.service';
import {AppService} from './services/app/app.service';
import {NavService} from './services/nav/nav.service';
import {SettingService} from './services/setting/setting.service';
import {PersonaService} from './services/persona/persona.service';
import {PwaService} from './services/pwa/pwa.service';
import {DateService} from './services/date/date.service';
import {CurrencyService} from './services/currency/currency.service';
import {NotifyService} from './services/notify/notify.service';
import {CartService} from './services/cart/cart.service';
import {PlayerService} from './services/player/player.service';
import {AuthService} from './services/auth/auth.service';
import {UserService} from './services/user/user.service';
import {DatabaseService} from './services/database/database.service';

import {TagDataService} from './schematas/tag/tag.service';
import {CategoryDataService} from './schematas/category/category.service';
import {PageDataService} from './schematas/page/page.service';
import {PostDataService} from './schematas/post/post.service';
import {OptionDataService} from './schematas/option/option.service';
import {ProfileDataService} from './schematas/profile/profile.service';
import {UserDataService} from './schematas/user/user.service';

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
    RouterLinkDirectiveModule,
  ],
  providers: [
    // normal services
    HelperService,
    ErrorService,
    NetworkService,
    LocalstorageService,
    CacheService,
    FetchService,
    MetaService,
    AppService,
    NavService,
    SettingService,
    PersonaService,
    PwaService,
    DateService,
    CurrencyService,
    NotifyService,
    CartService,
    PlayerService,
    AuthService,
    UserService,
    DatabaseService,
    // data services
    TagDataService,
    CategoryDataService,
    PageDataService,
    PostDataService,
    OptionDataService,
    ProfileDataService,
    UserDataService,
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
    RouterLinkDirectiveModule,
  ]
})
export class UsefulModule { }

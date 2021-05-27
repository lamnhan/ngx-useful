import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  LocalstorageService,
  AppService,
  MetaService,
  NavService,
  SettingService,
} from '@lamnhan/ngx-useful';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponentModule } from './components/header/header.module';
import { Header2ndComponentModule } from './components/header2nd/header2nd.module';
import { FooterComponentModule } from './components/footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponentModule,
    Header2ndComponentModule,
    FooterComponentModule,
  ],
  providers: [
    LocalstorageService,
    AppService,
    MetaService,
    NavService,
    SettingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

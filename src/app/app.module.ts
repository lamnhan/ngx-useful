import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  LocalstorageService,
  AppService,
  MetaService,
  NavService,
  SettingService,
  RouterLinkDirectiveModule
} from '@lamnhan/ngx-useful';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { OopsComponent } from './pages/oops/oops.component';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent, 
    OopsComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLinkDirectiveModule,
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

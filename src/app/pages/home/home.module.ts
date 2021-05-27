import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { MenuComponentModule } from '../../components/menu/menu.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    MenuComponentModule,
    HomeRoutingModule
  ]
})
export class HomePageModule {}

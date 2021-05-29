import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { ContentComponentModule } from '../../components/content/content.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    ContentComponentModule,
    HomeRoutingModule
  ]
})
export class HomePageModule {}

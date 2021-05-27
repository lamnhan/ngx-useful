import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveModule } from '@lamnhan/ngx-useful';

import { ContentComponentModule } from '../../components/content/content.module';

import { ServicesRoutingModule } from './services-routing.module';
import { ServicesComponent } from './services.component';

@NgModule({
  declarations: [
    ServicesComponent
  ],
  imports: [
    CommonModule,
    RouterLinkDirectiveModule,
    ContentComponentModule,
    ServicesRoutingModule
  ]
})
export class ServicesPageModule {}

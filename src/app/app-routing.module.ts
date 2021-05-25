import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import {HomeComponent} from './pages/home/home.component';
import {OopsComponent} from './pages/oops/oops.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},  
  {path: '**', component: OopsComponent},
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

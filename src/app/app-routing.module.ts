import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

import {HomeComponent} from './pages/home/home.component';
import {OopsComponent} from './pages/oops/oops.component';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  { path: 'guides', loadChildren: () => import('./pages/guides/guides.module').then(m => m.GuidesModule) },
  { path: 'guide/:id', loadChildren: () => import('./pages/guide/guide.module').then(m => m.GuideModule) },
  { path: 'services', loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesModule) },
  { path: 'service/:id', loadChildren: () => import('./pages/service/service.module').then(m => m.ServiceModule) },
  { path: 'pipes', loadChildren: () => import('./pages/pipes/pipes.module').then(m => m.PipesModule) },
  { path: 'pipe/:id', loadChildren: () => import('./pages/pipe/pipe.module').then(m => m.PipeModule) },
  { path: 'directives', loadChildren: () => import('./pages/directives/directives.module').then(m => m.DirectivesModule) },
  { path: 'directive/:id', loadChildren: () => import('./pages/directive/directive.module').then(m => m.DirectiveModule) },  
  { path: 'guards', loadChildren: () => import('./pages/guards/guards.module').then(m => m.GuardsModule) },
  { path: 'guard/:id', loadChildren: () => import('./pages/guard/guard.module').then(m => m.GuardModule) },
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

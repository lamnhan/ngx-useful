import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuicklinkModule, QuicklinkStrategy } from 'ngx-quicklink';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), pathMatch: 'full' },
  { path: 'guides', loadChildren: () => import('./pages/guides/guides.module').then(m => m.GuidesPageModule) },
  { path: 'guide/:id', loadChildren: () => import('./pages/guide/guide.module').then(m => m.GuidePageModule) },
  { path: 'services', loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesPageModule) },
  { path: 'service/:id', loadChildren: () => import('./pages/service/service.module').then(m => m.ServicePageModule) },
  { path: 'pipes', loadChildren: () => import('./pages/pipes/pipes.module').then(m => m.PipesPageModule) },
  { path: 'pipe/:id', loadChildren: () => import('./pages/pipe/pipe.module').then(m => m.PipePageModule) },
  { path: 'directives', loadChildren: () => import('./pages/directives/directives.module').then(m => m.DirectivesPageModule) },
  { path: 'directive/:id', loadChildren: () => import('./pages/directive/directive.module').then(m => m.DirectivePageModule) },  
  { path: 'guards', loadChildren: () => import('./pages/guards/guards.module').then(m => m.GuardsPageModule) },
  { path: 'guard/:id', loadChildren: () => import('./pages/guard/guard.module').then(m => m.GuardPageModule) },
  { path: '**', loadChildren: () => import('./pages/oops/oops.module').then(m => m.OopsPageModule) },
];

@NgModule({
  imports: [
    QuicklinkModule,
    RouterModule.forRoot(routes, { preloadingStrategy: QuicklinkStrategy })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

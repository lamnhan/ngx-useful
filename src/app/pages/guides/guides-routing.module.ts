import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuidesComponent } from './guides.component';

const routes: Routes = [{ path: '', component: GuidesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuidesRoutingModule {}

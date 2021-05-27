import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OopsComponent } from './oops.component';

const routes: Routes = [{ path: '', component: OopsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OopsRoutingModule {}

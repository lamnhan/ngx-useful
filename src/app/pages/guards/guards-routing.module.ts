import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardsComponent } from './guards.component';

const routes: Routes = [{ path: '', component: GuardsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuardsRoutingModule { }

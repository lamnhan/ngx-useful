import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectiveComponent } from './directive.component';

const routes: Routes = [{ path: '', component: DirectiveComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DirectiveRoutingModule { }

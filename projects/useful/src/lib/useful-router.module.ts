import { NgModule } from '@angular/core';

import { RouterLinkDirectiveModule } from './directives/router-link/router-link.module';
import { RouterExternalActiveDirectiveModule } from './directives/router-external-active/router-external-active.module';

@NgModule({
  imports: [
    RouterLinkDirectiveModule,
    RouterExternalActiveDirectiveModule,
  ],
  exports: [
    RouterLinkDirectiveModule,
    RouterExternalActiveDirectiveModule,
  ]
})
export class UsefulRouterModule {}

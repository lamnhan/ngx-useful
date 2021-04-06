import {NgModule} from '@angular/core';

import {RouterExternalActiveDirective} from './router-external-active.directive';

@NgModule({
  declarations: [
    RouterExternalActiveDirective,
  ],
  exports: [
    RouterExternalActiveDirective,
  ]
})
export class RouterExternalActiveDirectiveModule {}

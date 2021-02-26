import {NgModule} from '@angular/core';

import {RouterLinkDirective} from './router-link.directive';

@NgModule({
  declarations: [
    RouterLinkDirective,
  ],
  exports: [
    RouterLinkDirective,
  ]
})
export class RouterLinkDirectiveModule {}

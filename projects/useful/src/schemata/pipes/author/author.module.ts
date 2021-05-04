import { NgModule } from '@angular/core';

import { AuthorPipe } from './author.pipe';

@NgModule({
  declarations: [AuthorPipe],
  imports: [],
  exports: [AuthorPipe]
})
export class AuthorDataPipeModule {}

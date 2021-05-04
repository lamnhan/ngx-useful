import { NgModule } from '@angular/core';

import { PostPipe } from './post.pipe';

@NgModule({
  declarations: [PostPipe],
  imports: [],
  exports: [PostPipe]
})
export class PostDataPipeModule {}

import { Pipe, PipeTransform } from '@angular/core';

import { CacheConfig } from '../../../lib/services/cache/cache.service';
import { PostDataService } from '../../services/post/post.service';

@Pipe({
  name: 'postDoc'
})
export class PostPipe implements PipeTransform {
  constructor(private dataService: PostDataService) {}
  transform(id: string, caching?: false | CacheConfig) {
    return this.dataService.getDoc(id, caching);
  }
}

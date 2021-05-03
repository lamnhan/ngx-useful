import { Pipe, PipeTransform } from '@angular/core';

import { CacheConfig } from '../../../lib/services/cache/cache.service';
import { TagDataService } from '../../services/tag/tag.service';

@Pipe({
  name: 'tagDoc'
})
export class TagPipe implements PipeTransform {
  constructor(private dataService: TagDataService) {}
  transform(id: string, caching?: false | CacheConfig) {
    return this.dataService.getDoc(id, caching);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

import { CacheConfig } from '../../../lib/services/cache/cache.service';
import { PageDataService } from '../../services/page/page.service';

@Pipe({
  name: 'pageDoc'
})
export class PagePipe implements PipeTransform {
  constructor(private dataService: PageDataService) {}
  transform(id: string, caching?: false | CacheConfig) {
    return this.dataService.getDoc(id, caching);
  }
}

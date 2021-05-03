import { Pipe, PipeTransform } from '@angular/core';

import { CacheConfig } from '../../../lib/services/cache/cache.service';
import { CategoryDataService } from '../../services/category/category.service';

@Pipe({
  name: 'categoryDoc'
})
export class CategoryPipe implements PipeTransform {
  constructor(private dataService: CategoryDataService) {}
  transform(id: string, caching?: false | CacheConfig) {
    return this.dataService.getDoc(id, caching);
  }
}

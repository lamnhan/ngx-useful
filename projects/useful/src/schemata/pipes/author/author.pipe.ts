import { Pipe, PipeTransform } from '@angular/core';

import { CacheConfig } from '../../../lib/services/cache/cache.service';
import { AuthorDataService } from '../../services/author/author.service';

@Pipe({
  name: 'authorDoc'
})
export class AuthorPipe implements PipeTransform {
  constructor(private dataService: AuthorDataService) {}
  transform(id: string, caching?: false | CacheConfig) {
    return this.dataService.getDoc(id, caching);
  }
}

import { Injectable } from '@angular/core';
import { Post } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class PostDataService extends DataService<Post> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'posts');
  }
}

import { Injectable } from '@angular/core';
import { Post } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class PostDataService extends DatabaseData<Post> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'posts');
  }
}

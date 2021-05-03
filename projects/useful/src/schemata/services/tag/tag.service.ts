import { Injectable } from '@angular/core';
import { Tag } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TagDataService extends DatabaseData<Tag> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'tags');
  }
}

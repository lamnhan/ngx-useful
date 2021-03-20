import { Injectable } from '@angular/core';
import { Tag } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TagDataService extends DataService<Tag> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'tags');
  }
}

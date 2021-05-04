import { Injectable } from '@angular/core';
import { Author } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorDataService extends DatabaseData<Author> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'authors');
  }
}

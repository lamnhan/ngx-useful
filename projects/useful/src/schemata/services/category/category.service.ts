import { Injectable } from '@angular/core';
import { Category } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService extends DatabaseData<Category> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'categories');
  }
}

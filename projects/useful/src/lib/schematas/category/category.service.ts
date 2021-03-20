import { Injectable } from '@angular/core';
import { Category } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryDataService extends DataService<Category> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'categories');
  }
}

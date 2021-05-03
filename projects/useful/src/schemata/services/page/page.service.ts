import { Injectable } from '@angular/core';
import { Page } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService extends DatabaseData<Page> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'pages');
  }
}

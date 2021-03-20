import { Injectable } from '@angular/core';
import { Page } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class PageDataService extends DataService<Page> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'pages');
  }
}

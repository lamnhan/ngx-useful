import { Injectable } from '@angular/core';
import { Meta } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class MetaDataService extends DatabaseData<Meta> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'metas');
  }
}

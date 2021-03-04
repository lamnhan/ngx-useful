import { Injectable } from '@angular/core';
import { Option } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class OptionDataService extends DataService<Option> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'options');
  }
}

import { Injectable } from '@angular/core';
import { User } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService extends DataService<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'users');
  }
}

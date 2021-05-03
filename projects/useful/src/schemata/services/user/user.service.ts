import { Injectable } from '@angular/core';
import { User } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService extends DatabaseData<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'users');
  }
}

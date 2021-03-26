import { Injectable } from '@angular/core';
import { User } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService extends DatabaseData<User> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'users');
  }
}

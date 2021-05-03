import { Injectable } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

import { DatabaseService, DatabaseData } from '../../../lib/services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService  extends DatabaseData<Profile> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'profiles');
  }
}


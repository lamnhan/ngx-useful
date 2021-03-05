import { Injectable } from '@angular/core';
import { Profile } from '@lamnhan/schemata';

import { DatabaseService, DataService } from '../../services/database/database.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService  extends DataService<Profile> {
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'profiles');
  }
}


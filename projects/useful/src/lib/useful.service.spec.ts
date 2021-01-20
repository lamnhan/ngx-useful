import { TestBed } from '@angular/core/testing';

import { UsefulService } from './useful.service';

describe('UsefulService', () => {
  let service: UsefulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsefulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

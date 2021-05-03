import { TestBed } from '@angular/core/testing';

import { OptionService } from './option.service';

describe('OptionService', () => {
  let service: OptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

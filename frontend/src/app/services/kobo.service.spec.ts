import { TestBed } from '@angular/core/testing';

import { KoboService } from './kobo.service';

describe('KoboService', () => {
  let service: KoboService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KoboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

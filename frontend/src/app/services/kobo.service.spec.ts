import { TestBed } from '@angular/core/testing';

import { KoboService } from './kobo.service';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('KoboService', () => {
  let service: KoboService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [

        ],
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
        ]
    });
    service = TestBed.inject(KoboService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

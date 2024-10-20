import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [

        ],
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
        ]
    });
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

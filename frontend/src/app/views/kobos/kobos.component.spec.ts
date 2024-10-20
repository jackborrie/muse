import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KobosComponent } from './kobos.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('KobosComponent', () => {
  let component: KobosComponent;
  let fixture: ComponentFixture<KobosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KobosComponent],
        providers: [
            provideHttpClient(),
            provideHttpClientTesting(),
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KobosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

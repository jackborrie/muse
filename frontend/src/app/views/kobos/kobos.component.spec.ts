import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KobosComponent } from './kobos.component';

describe('KobosComponent', () => {
  let component: KobosComponent;
  let fixture: ComponentFixture<KobosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KobosComponent]
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

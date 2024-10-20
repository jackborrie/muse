import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BooksComponent} from './books.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";

describe('BooksComponent', () => {
    let component: BooksComponent;
    let fixture: ComponentFixture<BooksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BooksComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BooksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

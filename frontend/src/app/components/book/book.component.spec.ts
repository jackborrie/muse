import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BookComponent}            from './book.component';
import {provideHttpClient}        from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {Book}                     from "../../models/book";

describe('BookComponent', () => {
    let component: BookComponent;
    let fixture: ComponentFixture<BookComponent>;

    let testBook = new Book();

    testBook.title = "Test Book";
    testBook.public = true;
    testBook.id = 'testbookid';
    testBook.hasCover = false;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BookComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        }).compileComponents();
    });

    it('should create', () => {
        const fixture = TestBed.createComponent(BookComponent);
        const book = fixture.debugElement.componentInstance;
        expect(book).toBeTruthy();

        book.book = testBook;

        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;

        const container = compiled.querySelector('.book');

        expect(container).toBeTruthy();

    });

    it('should show the correct book title', () => {
        const fixture = TestBed.createComponent(BookComponent);
        const book = fixture.debugElement.componentInstance;

        book.book = testBook;

        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;

        const title = compiled.querySelector('.book-name');

        expect(title?.textContent).toBe('hello');
    });
});

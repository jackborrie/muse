import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MuseInputDirective} from "../../directives/muse-input.directive";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {BookService} from "../../services/book.service";
import {Book} from "../../models/book";
import {NgForOf, NgIf} from "@angular/common";
import {GridComponent} from "../../components/grid/grid.component";
import {MuseTemplate} from "../../directives/muse-template.directive";

@Component({
    selector: 'app-books',
    standalone: true,
    imports: [
        MuseInputDirective,
        MuseButtonDirective,
        DropdownComponent,
        NgForOf,
        NgIf,
        GridComponent,
        MuseTemplate,
    ],
    templateUrl: './books.component.html',
    styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit {

    @ViewChild('booksContainer')
    protected bookContainer!: ElementRef;
    @ViewChild('allBooks')
    protected allBooks!: ElementRef;

    protected books: Book[] = [];

    protected currentPage: number = 1;
    protected pageSize: number = 25;
    protected totalPages: number = 0;

    public constructor(
        private _books: BookService
    ) {
    }

    public ngOnInit() {
        this._getBooks();
    }

    private _getBooks() {
        this._books.getBooks(this.currentPage - 1, this.pageSize)
            .subscribe(data => {
                this.books = data.data;
                this.totalPages = data.totalPages;
            });
    }

    protected downloadBook (book: Book): void {
        this._books.downloadBook(book).subscribe(d => {
            console.log(d);
        });
    }

    protected handleDoubleClick(id: string | null) {
        if (id == null) {
            return;
        }
        // Route to the book
    }
}

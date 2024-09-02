import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MuseInputDirective}                                                 from "../../directives/muse-input.directive";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {BookService} from "../../services/book.service";
import {Book}          from "../../models/book";
import {NgForOf, NgIf} from "@angular/common";
import {StateService}                                                       from "../../services/state.service";
import {convertRemToPixels}                                                 from "../../lib/convert-rem-to-pixels";
import {Subscription}                                                       from "rxjs";

@Component({
  selector: 'app-books',
  standalone: true,
    imports: [
        MuseInputDirective,
        MuseButtonDirective,
        DropdownComponent,
        NgForOf,
        NgIf,
    ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent implements OnInit, AfterViewInit {

    @ViewChild('booksContainer')
    protected bookContainer!: ElementRef;
    @ViewChild('allBooks')
    protected allBooks!: ElementRef;

    protected books: Book[] = [];

    protected currentPage: number = 1;
    protected pageSize: number = 25;
    protected totalPages: number = 0;

    private _subscriptions: Subscription;

    public constructor(
        private _books: BookService,
        private renderer: Renderer2,
        private _state: StateService
    ) {
        this._subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this._getBooks();
        let sidebarHeightSub = this._state.$onSidebarHeightChanged.subscribe(height => {
            height = height - 66 - 66 - (convertRemToPixels(1) * 2);

            if (this.allBooks == null) {
                return;
            }

            this.renderer.setStyle(this.allBooks.nativeElement, 'maxHeight', height + 'px');
            this.renderer.setStyle(this.allBooks.nativeElement, 'minHeight', height + 'px');
        });

        this._subscriptions.add(sidebarHeightSub);
    }

    protected setPage (page: number) {
        this.currentPage = page;
        this._getBooks();
    }

    protected setPageSize (pageSize: number) {
        this.currentPage = 1;
        this.pageSize = pageSize;
        this._getBooks();
    }

    private _getBooks () {
        this._books.getBooks(this.currentPage - 1, this.pageSize)
            .subscribe(data => {
            this.books = data.data;
            this.totalPages = data.totalPages;
        });
    }

    ngAfterViewInit(): void {
        if (!this.bookContainer || !this.allBooks) {
            return;
        }

        let height = this.bookContainer.nativeElement.clientHeight;

        this.renderer.setStyle(this.allBooks.nativeElement, 'maxHeight', height + 'px');
        this.renderer.setStyle(this.allBooks.nativeElement, 'minHeight', height + 'px');
    }

    handleDoubleClick (id: string | null) {
        if (id == null) {
            return;
        }
        // Route to the book
    }
}

import {Component, Input}    from '@angular/core';
import {Book}                from "../../models/book";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {DropdownComponent}   from "../dropdown/dropdown.component";
import {BookService}         from "../../services/book.service";

@Component({
    selector: 'app-book[book]',
    standalone: true,
    imports: [
        MuseButtonDirective,
        DropdownComponent
    ],
    templateUrl: './book.component.html',
    styleUrl: './book.component.scss'
})
export class BookComponent {

    @Input()
    public book!: Book;

    public constructor(
        private _bookService: BookService
    ) {
    }

    protected handleDownload() {
        this._bookService.downloadBook(this.book);
    }
}

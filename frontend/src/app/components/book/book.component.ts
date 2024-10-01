import { Component, Input } from '@angular/core';
import {Book}        from "../../models/book";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {DropdownComponent} from "../dropdown/dropdown.component";

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

}

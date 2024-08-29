import { Component } from '@angular/core';
import {MuseInputDirective} from "../../directives/muse-input.directive";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";

@Component({
  selector: 'app-books',
  standalone: true,
    imports: [
        MuseInputDirective,
        MuseButtonDirective,
        DropdownComponent,
    ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {

}

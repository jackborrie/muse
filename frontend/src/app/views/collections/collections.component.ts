import { Component } from '@angular/core';
import {GridComponent} from "../../components/grid/grid.component";

@Component({
  selector: 'app-collections',
  standalone: true,
    imports: [
        GridComponent
    ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.scss'
})
export class CollectionsComponent {

}

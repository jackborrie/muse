import { Component } from '@angular/core';
import {SectionComponent} from "../../components/section/section.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        SectionComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

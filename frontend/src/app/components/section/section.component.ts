import {Component, Input}                from '@angular/core';
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {MuseButtonDirective}             from "../../directives/muse-button.directive";

@Component({
  selector: 'm-section[title]',
  standalone: true,
    imports: [
        NgIf,
        MuseButtonDirective,
        NgClass,
        NgTemplateOutlet,
    ],
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent {

    @Input()
    title: string | null = null;

    protected contentHidden: boolean = false;

}

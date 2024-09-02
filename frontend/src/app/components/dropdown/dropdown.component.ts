import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    Input,
    PLATFORM_ID,
    Renderer2,
    ViewChild
}                                                  from '@angular/core';
import {ButtonColor, IconPos, MuseButtonDirective} from "../../directives/muse-button.directive";
import {NgClass, NgIf, NgStyle}                    from "@angular/common";

export type DropdownPosition = 'top-left' | 'top-right' | 'right-top' | 'right-bottom' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom';

@Component({
  selector: 'm-dropdown',
  standalone: true,
    imports: [
        MuseButtonDirective,
        NgClass,
        NgIf,
        NgStyle
    ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements AfterViewInit {

    @ViewChild('dropdown')
    protected dropdown!: ElementRef;
    @ViewChild('button')
    protected button!: ElementRef;
    @ViewChild('split')
    protected split!: ElementRef;

    @Input()
    icon?: string;
    @Input()
    text?: string;
    @Input()
    iconPos: IconPos = 'right';
    @Input()
    color: ButtonColor = 'primary';

    @Input()
    showDropdownCaret: boolean = false;

    @Input()
    dropdownPosition?: DropdownPosition;

    protected isDropdownDown = false;

    public constructor(
    ) {
    }

    protected handleDropdownClick () {
        this.isDropdownDown = !this.isDropdownDown;
    }

    ngAfterViewInit() {
        if (this.dropdownPosition == null) {
            this._calculateDropdownPosition();
        }

        this.dropdown.nativeElement.classList.add(this.dropdownPosition);

        let width = this.button.nativeElement.clientWidth ?? 0;

        this.split.nativeElement.setAttribute('style', `--thick: ${width}px`);
    }

    @HostListener('window:click', ['$event.target'])
    public onClick(target: EventTarget) {
        if (!this.dropdown) {
            return;
        }
        if (this.dropdown.nativeElement.contains(target)) {
            return;
        }

        this.isDropdownDown = false;
    }

    private _calculateDropdownPosition () {
        const {top, left} = this.dropdown.nativeElement.getBoundingClientRect();
        const windowHeight = window.outerHeight;
        const windowWidth = window.outerWidth;

        let position: any = '';

        if (top < windowHeight - 300) {
            position += 'bottom';
        } else {
            position += 'top';
        }

        position += '-';

        if (left < windowWidth - 500) {
            position += 'right';
        } else {
            position += 'left';
        }

        this.dropdownPosition = position;
    }
}

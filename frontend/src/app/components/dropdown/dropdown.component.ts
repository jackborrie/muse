import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    Input,
    PLATFORM_ID,
    Renderer2, TemplateRef,
    ViewChild
} from '@angular/core';
import {ButtonColor, IconPos, MuseButtonDirective} from "../../directives/muse-button.directive";
import {NgClass, NgIf, NgStyle}                   from "@angular/common";
import {DropdownChangeInterface, DropdownService} from "../../services/dropdown.service";

export type DropdownPosition = 'top-left' | 'top-right' | 'right-top' | 'right-bottom' | 'bottom-left' | 'bottom-right' | 'left-top' | 'left-bottom';

@Component({
  selector: 'm-dropdown[template]',
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

    @Input()
    template!: TemplateRef<any>;

    protected isDropdownDown = false;

    public constructor(
        private _dropdownService: DropdownService
    ) {
    }

    protected handleDropdownClick () {
        this.isDropdownDown = !this.isDropdownDown;
        if (!this.isDropdownDown) {
            this._dropdownService.setDropdown(null);
            return;
        }

        let buttonPosition = this.button.nativeElement.getBoundingClientRect();
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        let position: {
            top?: string,
            right?: string,
            bottom?: string,
            left?: string
        } = {};

        if (this.dropdownPosition?.startsWith('bottom-')) {
            position.top = (buttonPosition.bottom - 1) + 'px';
        }

        if (this.dropdownPosition?.endsWith('-left')) {
            console.log(windowWidth, buttonPosition.right, windowWidth - buttonPosition.right)
            position.right = (windowWidth - buttonPosition.right + 1) + 'px';
        }

        let dropdown: DropdownChangeInterface = {
            template: this.template,
            position: position
        }

        this._dropdownService.setDropdown(dropdown);
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

        // this._dropdownService.setDropdown(null);
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

    test () {
    console.log('test')
    }
}

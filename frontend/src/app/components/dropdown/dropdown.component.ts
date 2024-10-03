import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ButtonColor, IconPos, MuseButtonDirective}                                                            from "../../directives/muse-button.directive";
import {NgClass, NgIf, NgStyle}                                                                               from "@angular/common";
import {DropdownChangeInterface, DropdownService}                                                             from "../../services/dropdown.service";
import {Subscription}                                                                                         from "rxjs";

export type DropdownPosition =
    'top-left'
    | 'top-right'
    | 'right-top'
    | 'right-bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-top'
    | 'left-bottom';

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
export class DropdownComponent implements OnInit, AfterViewInit, OnDestroy {

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

    private _subscriptions: Subscription = new Subscription();

    public constructor(
        private _dropdownService: DropdownService
    ) {
    }

    public ngOnInit() {
        const stateSub = this._dropdownService.$onDropdownChanged
            .subscribe((s) => {
                if (s == null || s.template != this.template) {
                    this.isDropdownDown = false;
                }
            });

        this._subscriptions.add(stateSub);
    }

    public ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }

    protected handleDropdownClick() {
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

        if (this.dropdownPosition?.startsWith('top-')) {
            position.bottom = (windowHeight - buttonPosition.top - 1) + 'px';
        }

        if (this.dropdownPosition?.startsWith('right-')) {
            position.left = (buttonPosition.right - 1) + 'px';
        }

        if (this.dropdownPosition?.startsWith('left-')) {
            position.right = (windowWidth - buttonPosition.left - 1) + 'px';
        }

        if (this.dropdownPosition?.endsWith('-left')) {
            position.right = (windowWidth - buttonPosition.right) + 'px';
        }

        if (this.dropdownPosition?.endsWith('-right')) {
            position.left = buttonPosition.left + 'px';
        }

        if (this.dropdownPosition?.endsWith('-top')) {
            position.bottom = (windowHeight - buttonPosition.bottom) + 'px';
        }

        if (this.dropdownPosition?.endsWith('bottom')) {
            position.top = (buttonPosition.top) + 'px';
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
        if (!this.isDropdownDown) {
            return;
        }

        if (this.dropdown != null && this.dropdown.nativeElement.contains(target)) {
            this._dropdownService.wasButtonClicked(true);
            return;
        }

        this._dropdownService.wasButtonClicked(false);
    }

    private _calculateDropdownPosition() {
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

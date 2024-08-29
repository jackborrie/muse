import {Directive, ElementRef, Inject, Input, OnInit, PLATFORM_ID, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {clearChildren} from "../lib/clear-children";

export type IconPos = 'left' | 'right';
export type ButtonColor = 'primary' | 'accent';

@Directive({
    selector: 'button[mButton]',
    standalone: true,
})
export class MuseButtonDirective implements OnInit {

    @Input()
    icon?: string;
    @Input()
    text?: string;
    @Input()
    iconPos: IconPos = 'right';
    @Input()
    color: ButtonColor = 'primary';
    @Input()
    allowSSR: boolean = false;

    protected readonly BUTTON_CLASS = 'muse-button';
    protected readonly ICON_BUTTON_CLASS = 'muse-icon-button';

    constructor(
        protected el: ElementRef,
        protected renderer: Renderer2,
        @Inject(DOCUMENT) protected document: Document
    ) {
    }

    ngOnInit() {
        this._renderButton();
    }

    private _renderButton (fresh = false) {
        if (fresh) {
            // Clear all children if fresh is true
            clearChildren(this.el);
        }

        let isIconOnly = this.text == null && this.icon != null;

        if (isIconOnly) {
            this.el.nativeElement.classList.add(this.ICON_BUTTON_CLASS);
        } else {
            this.el.nativeElement.classList.add(this.BUTTON_CLASS);
        }

        this.el.nativeElement.classList.add(this.color);

        if (this.text != null && !isIconOnly) {
            const textElement = this.renderer.createText(this.text);
            this.el.nativeElement.insertBefore(textElement, this.el.nativeElement.firstChild);
        }

        if (this.icon != null) {
            const iconElement = this.document.createElement('i');

            iconElement.classList.add('ph');
            iconElement.classList.add(this.icon);

            if (this.iconPos == 'right') {
                this.el.nativeElement.appendChild(iconElement);
            } else {
                this.el.nativeElement.insertBefore(iconElement, this.el.nativeElement.firstChild);
            }
        }
    }
}

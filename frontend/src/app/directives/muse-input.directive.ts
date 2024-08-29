import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[mInput]',
    standalone: true
})
export class MuseInputDirective implements OnInit {

    constructor(
        protected el: ElementRef
    ) {
    }

    ngOnInit() {
        this.el.nativeElement.classList.add('companion-input');
    }
}

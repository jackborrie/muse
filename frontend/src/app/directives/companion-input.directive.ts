import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
    selector: '[cInput]',
    standalone: true
})
export class CompanionInputDirective implements OnInit {

    constructor(
        protected el: ElementRef
    ) {
    }

    ngOnInit() {
        this.el.nativeElement.classList.add('companion-input');
    }
}

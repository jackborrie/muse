import {AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild} from '@angular/core';
import {NgClass, NgIf, NgTemplateOutlet}                                                 from "@angular/common";
import {MuseButtonDirective}                                                             from "../../directives/muse-button.directive";
import {convertRemToPixels}                                                              from "../../lib/convert-rem-to-pixels";

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
export class SectionComponent implements AfterViewInit {

    @ViewChild('sectionContent')
    sectionContent!: ElementRef;

    @Input()
    title: string | null = null;

    protected contentHidden = false;

    public constructor(
        private _renderer: Renderer2
    ) {
    }

    ngAfterViewInit() {
        this.calculateSectionWidth();
    }


    @HostListener('window:resize')
    public onWindowResize() {
        this.calculateSectionWidth();
    }

    private calculateSectionWidth() {
        let windowWidth = window.innerWidth;

        windowWidth -= convertRemToPixels(5); // Remove padding for sidebar, content and outside;
        windowWidth -= 64; // Sidebar width
        windowWidth -= 2; // section border

        this._renderer.setStyle(this.sectionContent.nativeElement, 'maxWidth', windowWidth + 'px');
    }
}

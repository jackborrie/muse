import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    Inject,
    Input, OnDestroy, OnInit,
    PLATFORM_ID,
    QueryList,
    TemplateRef, ViewChild
} from '@angular/core';
import {NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {MuseTemplate}                    from "../../directives/muse-template.directive";
import {getTemplate}                     from "../../lib/get-template";
import {fromEvent, Subscription} from "rxjs";

@Component({
    selector: 'c-modal',
    standalone: true,
    imports: [
        NgTemplateOutlet,
        NgClass,
        NgIf
    ],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss'
})
export class ModalComponent implements  OnInit, AfterViewInit, OnDestroy {

    @ContentChildren(MuseTemplate)
    templates!: QueryList<MuseTemplate>;

    @ViewChild('modalBackdrop')
    backdrop!: ElementRef;
    @ViewChild('modal')
    modal!: ElementRef;

    @Input()
    showElement?: HTMLButtonElement;

    visible: boolean = false;

    private _subscriptions: Subscription = new Subscription();

    public constructor(
    ) {
    }

    ngOnInit() {
        if (this.showElement != null) {
            const toggleElementClick = fromEvent(this.showElement, 'click').subscribe(() => {
                this.setVisible(true);
            })
            this._subscriptions.add(toggleElementClick);
        }
    }

    ngAfterViewInit() {
        const backdropClick = fromEvent(this.backdrop!.nativeElement, 'click')
            .subscribe((event) => {
                const e = event as PointerEvent;
                const target = e.target as HTMLElement;

                if (target == null) {
                    return;
                }

                if (!target.classList.contains('modal-backdrop')) {
                    return;
                }

                this.setVisible(false);
            });

        this._subscriptions.add(backdropClick);
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }

    public setVisible(visible: boolean) {
        this.visible = visible;
    }

    protected getTemplate(templateName: string): TemplateRef<any> | null {
        return getTemplate(this.templates, templateName);
    }
}

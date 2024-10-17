import {Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {DropdownComponent}                                                                                                         from "../dropdown/dropdown.component";
import {MuseInputDirective}                                                                                                        from "../../directives/muse-input.directive";
import {NgForOf, NgIf, NgTemplateOutlet}                                                                                           from "@angular/common";
import {MuseButtonDirective}                                                                                                       from "../../directives/muse-button.directive";
import {convertRemToPixels}                                                                                                        from "../../lib/convert-rem-to-pixels";
import {StateService}                                                                                                              from "../../services/state.service";
import {Subscription}                                                                                                              from "rxjs";
import {getTemplate}                                                                                                               from "../../lib/get-template";
import {MuseTemplateDirective}                                                                                                     from "../../directives/muse-template.directive";

export interface GridPaginationInterface {
    pageSize: number;
    currentPage: number;
}

@Component({
    selector: 'm-grid',
    standalone: true,
    imports: [
        DropdownComponent,
        MuseButtonDirective,
        MuseInputDirective,
        NgForOf,
        NgIf,
        NgTemplateOutlet
    ],
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit {

    @ViewChild('rowsContainer')
    protected rowsContainer!: ElementRef;
    @ViewChild('allRows')
    protected allRows!: ElementRef;
    @ContentChildren(MuseTemplateDirective)
    protected templates!: QueryList<MuseTemplateDirective>;

    @Input()
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public rows: any[] = [];

    protected currentPage = 1;
    protected pageSize = 25;

    @Input()
    public totalPages = 1;

    @Input()
    public showAdd = false;

    @Input()
    public pageSizes: number[] = [5, 10, 15, 25];

    @Output()
    public paginationChanged: EventEmitter<GridPaginationInterface> = new EventEmitter<GridPaginationInterface>();

    @Output()
    public rowDoubleClick: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    public addClicked: EventEmitter<null> = new EventEmitter<null>();

    private _subscriptions: Subscription;

    public constructor(
        private renderer: Renderer2,
        private _state: StateService
    ) {
        this._subscriptions = new Subscription();
    }

    handleDoubleClick(id: string | null) {
        if (id == null) {
            return;
        }
        this.rowDoubleClick.next(id);
    }

    handleAddClicked() {
        this.addClicked.next(null);
    }

    protected setPage(page: number) {
        this.currentPage = page;
        this.echoPagination();
    }

    protected setPageSize(pageSize: number) {
        this.currentPage = 1;
        this.pageSize = pageSize;
        this.echoPagination();
    }

    private echoPagination() {
        const paginationData: GridPaginationInterface = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
        };

        this.paginationChanged.next(paginationData);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    protected getRowTemplate(templateName: string): TemplateRef<any> | null {
        return getTemplate(this.templates, templateName);
    }

    ngOnInit(): void {
        const sidebarHeightSub = this._state.$onSidebarHeightChanged.subscribe(height => {
            height = height - 66 - 66 - convertRemToPixels(2);

            if (this.allRows == null) {
                return;
            }

            this.renderer.setStyle(this.allRows.nativeElement, 'maxHeight', height + 'px');
            this.renderer.setStyle(this.allRows.nativeElement, 'minHeight', height + 'px');
        });

        this._subscriptions.add(sidebarHeightSub);
    }

    protected readonly getTemplate = getTemplate;
}

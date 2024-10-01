import {
    Component, ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    Renderer2, TemplateRef,
    ViewChild
} from '@angular/core';
import {DropdownComponent}                                                                from "../dropdown/dropdown.component";
import {MuseInputDirective}                                                               from "../../directives/muse-input.directive";
import {NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {MuseButtonDirective}                                                              from "../../directives/muse-button.directive";
import {convertRemToPixels}                                                               from "../../lib/convert-rem-to-pixels";
import {StateService}                                                                     from "../../services/state.service";
import {Subscription}                                                                     from "rxjs";
import {getTemplate} from "../../lib/get-template";
import {MuseTemplate} from "../../directives/muse-template.directive";

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
    @ContentChildren(MuseTemplate)
    protected templates!: QueryList<MuseTemplate>;

    @Input()
    public rows: any[] = [];

    protected currentPage: number = 1;
    protected pageSize: number = 25;

    @Input()
    public totalPages: number = 1;

    @Input()
    public pageSizes: number[] = [5, 10, 15, 25];

    @Output()
    public onPaginationChanged: EventEmitter<GridPaginationInterface> = new EventEmitter<GridPaginationInterface>();

    @Output()
    public onRowDoubleClick: EventEmitter<string> = new EventEmitter<string>();

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
        this.onRowDoubleClick.next(id);
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
        let paginationData: GridPaginationInterface = {
            currentPage: this.currentPage,
            pageSize: this.pageSize
        };

        this.onPaginationChanged.next(paginationData);
    }

    protected getRowTemplate(templateName: string): TemplateRef<any> | null {
        return getTemplate(this.templates, templateName);
    }

    ngOnInit(): void {
        let sidebarHeightSub = this._state.$onSidebarHeightChanged.subscribe(height => {
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

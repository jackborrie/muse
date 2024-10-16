import {Component, OnInit} from '@angular/core';
import {GridComponent}     from "../../components/grid/grid.component";
import {MuseTemplate}  from "../../directives/muse-template.directive";
import {Kobo}          from "../../models/kobo";
import {ModalComponent} from "../../components/modal/modal.component";
import {MuseButtonDirective} from "../../directives/muse-button.directive";
import {MuseInputDirective} from "../../directives/muse-input.directive";
import {FormsModule} from "@angular/forms";
import {KoboService}       from "../../services/kobo.service";
import {NgForOf, NgIf}     from "@angular/common";
import {DropdownComponent} from "../../components/dropdown/dropdown.component";
import {Collection} from "../../models/collection";
import {CollectionService} from "../../services/collection.service";

@Component({
    selector: 'app-kobos',
    standalone: true,
    imports: [
        GridComponent,
        MuseTemplate,
        MuseButtonDirective,
        ModalComponent,
        MuseInputDirective,
        FormsModule,
        NgIf,
        DropdownComponent,
        NgForOf
    ],
    templateUrl: './kobos.component.html',
    styleUrl: './kobos.component.scss'
})
export class KobosComponent implements OnInit {

    protected totalPages: number = 0;
    protected kobos: Kobo[] = [];

    protected newKoboName: string = '';
    protected getPublic: boolean = false;

    protected currentPage: number = 0;
    protected pageSize: number = 0;

    protected selectedCollection: Collection | null = null;
    protected collections: Collection[] | null = null;
    protected selectedKobo: Kobo | null = null;

    public constructor(
        private _koboService: KoboService,
        private _collectionService: CollectionService
    ) {
    }

    protected handleDoubleClick(koboId: string) {

    }

    public ngOnInit() {
        this._getKobos();
        this._getCollections();
    }

    protected handleKoboSave () {
        const creating = this.selectedKobo == null;

        let kobo: Kobo;

        if (this.selectedKobo == null) {
            kobo = new Kobo();
        } else {
            kobo = this.selectedKobo;
        }

        kobo.name = this.newKoboName;
        kobo.getPublic = this.getPublic ? this.getPublic == true : false;
        kobo.collectionId = this.selectedCollection ? this.selectedCollection.id : null;

        if (creating) {
            this._koboService.createKobo(kobo)
                .subscribe(() => {
                    this.newKoboName = '';
                    this.getPublic = false;
                    this.selectedCollection = null;
                    this._getKobos();
                });
        } else {
            this._koboService.updateKobo(kobo)
                .subscribe(() => {
                    this.newKoboName = '';
                    this.getPublic = false;
                    this.selectedCollection = null;
                    this.selectedKobo = null;
                    this._getKobos();
                });
        }
    }

    protected handleKoboDelete (id: string) {
        this._koboService.deleteKobo(id)
            .subscribe(() => {
                this._getKobos();
            });
    }

    protected getSelectedCollectionName () {
        if (this.collections == null) {
            return 'Loading';
        }

        return this.selectedCollection ? (this.selectedCollection.name ?? '') : 'Unset';
    }

    protected getCollectionName (collectionId: string) {
        if (this.collections == null || collectionId == null) {
            return;
        }
        const collection = this.collections.find(c => c.id == collectionId);

        return collection ? collection.name : 'Unset';
    }

    protected handleKoboEdit (kobo: Kobo) {
        this.selectedKobo = kobo;
        this.newKoboName = kobo.name ?? '';
        this.getPublic = kobo.getPublic ?? false;
        this._getCollections();
    }

    protected handleKoboCollectionClick (collection: Collection) {
        this.selectedCollection = collection;
    }

    private _getKobos() {
        this._koboService.getKobos(this.currentPage - 1, this.pageSize)
            .subscribe(data => {
                this.kobos = data.data;
                this.totalPages = data.totalPages;
                console.log(data);
            });
    }

    private _getCollections () {
        this.collections = null;
        this._collectionService.getAll()
            .subscribe(data => {
                console.log(data);
                if (this.selectedKobo != null && this.selectedKobo.collectionId != null) {
                    this.selectedCollection = data.data.find(c => c.id == this.selectedKobo?.collectionId) ?? null;
                }

                const defaultCollection = new Collection();

                defaultCollection.name = 'Unset';

                this.collections = [defaultCollection]

                this.collections.push(...data.data);
            });
    }
}

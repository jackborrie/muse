import {Component, OnInit, ViewChild} from '@angular/core';
import {MuseButtonDirective}          from "../../directives/muse-button.directive";
import {DropdownComponent}            from "../dropdown/dropdown.component";
import {FilteredData} from "../../models/filtered-data";
import {Theme} from "../../models/theme";
import {ThemeService} from "../../services/theme.service";
import {ModalComponent}                               from "../modal/modal.component";
import {MuseTemplate}                                 from "../../directives/muse-template.directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MuseInputDirective}                           from "../../directives/muse-input.directive";
import {AuthenticationService}                        from "../../services/authentication.service";
import {User} from "../../models/user";
import {CommonModule, NgIf} from "@angular/common";
import {BookService} from "../../services/book.service";
import {RouterLink} from "@angular/router";

export interface FileUploadInterface {
    uploaded: boolean;
    file: File;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        MuseButtonDirective,
        DropdownComponent,
        ModalComponent,
        MuseTemplate,
        ReactiveFormsModule,
        MuseInputDirective,
        CommonModule,
        RouterLink
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    @ViewChild(ModalComponent)
    AddNewModal!: ModalComponent;

    protected themes: FilteredData<Theme> | null = null;


    protected uploads: {[key: string]: FileUploadInterface} = {};

    protected homeIcon: string = 'ph-house';

    protected get uploading (): boolean {
        const keys = Object.keys(this.uploads);

        for (let key of keys) {
            if (!this.uploads[key].uploaded) {
                return true;
            }
        }

        return false;
    }

    public constructor(
        private _themes: ThemeService,
        private _books: BookService
    ) {
    }

    ngOnInit() {
        this._themes.$onAllThemesChange
            .subscribe(themes => {
                if (themes == null) {
                    return;
                }
                this.themes = themes;
            });

        // Random finn check
        if (Math.floor(Math.random() * (100 - 1 + 1) + 1) == 24) {
            this.homeIcon = 'ph-finn-the-human';
        }
    }

    public handleThemeSelect(theme: Theme) {
        this._themes.setTheme(theme);
    }

    protected handleFileDrop (event: DragEvent) {
        console.log(event)
        event.preventDefault();

        if (event.dataTransfer == null || event.dataTransfer.items == null) {
            return;
        }
        this._uploadBooks(event.dataTransfer.items);
    }

    protected handleDragOver (event: DragEvent) {
        // console.log(event)
    }

    protected handleFileUpload (event: any) {
        let fileList: FileList = event.target.files;

        if (fileList.length < 1) {
            return;
        }

        this._uploadBooks(fileList);
    }

    private _uploadBooks (files: any) {
        for (let fileIdx = 0; fileIdx < files.length; fileIdx++) {
            const file = files[fileIdx];

            this.uploads[file.name] = {
                uploaded: false,
                file: file
            }

            this._books.uploadBook(file).subscribe (result => {
                this.uploads[file.name].uploaded = true;
            })
        }
    }
}

import {AfterContentChecked, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MuseButtonDirective}                                           from "../../directives/muse-button.directive";
import {DropdownComponent}                                             from "../dropdown/dropdown.component";
import {FilteredData}                                                  from "../../models/filtered-data";
import {Theme}                                                         from "../../models/theme";
import {ThemeService}                                                  from "../../services/theme.service";
import {ModalComponent}                                                from "../modal/modal.component";
import {MuseTemplateDirective}                                         from "../../directives/muse-template.directive";
import {ReactiveFormsModule}                                           from "@angular/forms";
import {MuseInputDirective}                                            from "../../directives/muse-input.directive";
import {AuthenticationService}                                         from "../../services/authentication.service";
import {CommonModule}                                                  from "@angular/common";
import {BookService}                                                   from "../../services/book.service";
import {RouterLink}                                                    from "@angular/router";
import {StateService}                                                  from "../../services/state.service";
import {convertRemToPixels}                                            from "../../lib/convert-rem-to-pixels";

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
        MuseTemplateDirective,
        ReactiveFormsModule,
        MuseInputDirective,
        CommonModule,
        RouterLink
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, AfterContentChecked {

    @ViewChild(ModalComponent)
    AddNewModal!: ModalComponent;

    @ViewChild('sidebar')
    sidebar!: ElementRef;

    protected themes: FilteredData<Theme> | null = null;

    protected draggingOver = false;

    protected uploads: Record<string, FileUploadInterface> = {};

    protected homeIcon = 'ph-house';

    protected get uploading(): boolean {
        const keys = Object.keys(this.uploads);

        for (const key of keys) {
            if (!this.uploads[key].uploaded) {
                return true;
            }
        }

        return false;
    }

    public constructor(
        private _themes: ThemeService,
        private _books: BookService,
        private _state: StateService,
        private _authService: AuthenticationService
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

    ngAfterContentChecked() {
        this.handleResize();
    }

    protected handleResize() {
        if (this.sidebar == null) {
            return;
        }

        const sidebarRect = this.sidebar.nativeElement.getBoundingClientRect();
        // Calculate the expected height of the sidebar based on the window's inner height and the current sidebar offset
        const screenHeight = window.innerHeight - sidebarRect.top - convertRemToPixels(1);

        this._state.setHeight(screenHeight);

    }

    public handleThemeSelect(theme: Theme) {
        this._themes.setTheme(theme);
    }

    protected handleFileDrop(event: DragEvent) {
        console.log(event)
        event.preventDefault();

        if (event.dataTransfer == null || event.dataTransfer.items == null) {
            return;
        }
        this._uploadBooks(event.dataTransfer.items);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    protected handleFileUpload(event: any) {
        const fileList: FileList = event.target.files;

        if (fileList.length < 1) {
            return;
        }

        this._uploadBooks(fileList);
    }

    protected handleDragEnter() {
        this.draggingOver = true
    }

    protected handleDragLeave() {
        this.draggingOver = false
    }

    protected handleSignOut() {
        this._authService.logout();
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    private _uploadBooks(files: any) {
        for (const file of files) {
            this.uploads[file.name] = {
                uploaded: false,
                file: file
            }

            console.log('uploading file: ' + file.name)
            this._books.uploadBook(file).subscribe(() => {
                this.uploads[file.name].uploaded = true;
            }, () => {
                console.log('Book failed to upload: ' + file.name);
                this.uploads = {};
            })
        }
    }
}

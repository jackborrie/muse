import {Component, OnInit, ViewChild} from '@angular/core';
import {CompanionButtonDirective} from "../../directives/companion-button.directive";
import {DropdownComponent} from "../dropdown/dropdown.component";
import {FilteredData} from "../../models/filtered-data";
import {Theme} from "../../models/theme";
import {ThemeService} from "../../services/theme.service";
import {ModalComponent} from "../modal/modal.component";
import {CompanionTemplate} from "../../directives/companion-template.directive";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {CompanionInputDirective} from "../../directives/companion-input.directive";
import {AuthenticationService} from "../../services/authentication.service";
import {User} from "../../models/user";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CompanionButtonDirective,
        DropdownComponent,
        ModalComponent,
        CompanionTemplate,
        ReactiveFormsModule,
        CompanionInputDirective
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

    @ViewChild(ModalComponent)
    AddNewModal!: ModalComponent;

    protected themes: FilteredData<Theme> | null = null;

    protected newThemeFormGroup = this.formBuilder.group({
        themeName: ['#1a2b3c', Validators.required],
        themeClassName: ['#1a2b3c', Validators.required],
        background0: ['#1a2b3c', Validators.required],
        background1: ['#1a2b3c', Validators.required],
        background2: ['#1a2b3c', Validators.required],
        background3: ['#1a2b3c'],
        background4: ['#1a2b3c'],
        foreground0: ['#1a2b3c', Validators.required],
        foreground1: ['#1a2b3c', Validators.required],
        foreground2: ['#1a2b3c', Validators.required],
        foreground3: ['#1a2b3c'],
        foreground4: ['#1a2b3c'],
        red: ['#1a2b3c', Validators.required],
        yellow: ['#1a2b3c', Validators.required],
        orange: ['#1a2b3c', Validators.required],
        magenta: ['#1a2b3c', Validators.required],
        violet: ['#1a2b3c', Validators.required],
        blue: ['#1a2b3c', Validators.required],
        cyan: ['#1a2b3c', Validators.required],
        green: ['#1a2b3c', Validators.required],
        borderRadius: ['5px', Validators.required],
        borderThickness: ['1px', Validators.required],
        borderType: ['solid', Validators.required],
        borderColor: ['var(--foreground-0);', Validators.required],
        sideBarLeftPadding: ['1rem', Validators.required],
        sideBarTopPadding: ['1rem', Validators.required],
        sideBarBottomPadding: ['1rem', Validators.required],
        sideBarRightPadding: ['1rem', Validators.required],
        contentTopPadding: ['1rem', Validators.required],
        contentRightPadding: ['1rem', Validators.required],
        contentBottomPadding: ['1rem', Validators.required]
    })

    public constructor(
        private _themes: ThemeService,
        private formBuilder: FormBuilder,
        private _authentication: AuthenticationService
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
    }

    public handleThemeSelect(theme: Theme) {
        this._themes.setTheme(theme);
    }

    protected saveTheme() {
        this.newThemeFormGroup.markAllAsTouched();

        if (this.newThemeFormGroup.invalid) {
            return;
        }

        let theme = new Theme();

        theme.name = this.newThemeFormGroup.get('themeName')?.value ?? null;
        theme.className = this.newThemeFormGroup.get('themeClassName')?.value ?? null;

        let themeStyle = '';

        // Background

        themeStyle += '--background-0: ' + this.newThemeFormGroup.get('background0')?.value + ';';
        themeStyle += '--background-1: ' + this.newThemeFormGroup.get('background1')?.value + ';';
        themeStyle += '--background-2: ' + this.newThemeFormGroup.get('background2')?.value + ';';

        const background3 = this.newThemeFormGroup.get('background3')?.value;
        if (background3 != null && background3 !== '') {
            themeStyle += '--background-3: ' + background3 + ';';
        }
        const background4 = this.newThemeFormGroup.get('background4')?.value;
        if (background4 != null && background4 !== '') {
            themeStyle += '--background-3: ' + background4 + ';';
        }

        // Foreground

        themeStyle += '--foreground-0: ' + this.newThemeFormGroup.get('foreground0')?.value + ';';
        themeStyle += '--foreground-1: ' + this.newThemeFormGroup.get('foreground1')?.value + ';';
        themeStyle += '--foreground-2: ' + this.newThemeFormGroup.get('foreground2')?.value + ';';

        const foreground3 = this.newThemeFormGroup.get('foreground3')?.value;
        if (background3 != null && background3 !== '') {
            themeStyle += '--foreground-3: ' + background3 + ';';
        }
        const foreground4 = this.newThemeFormGroup.get('foreground4')?.value;
        if (background4 != null && background4 !== '') {
            themeStyle += '--foreground-3: ' + background4 + ';';
        }

        themeStyle += '--red: ' + this.newThemeFormGroup.get('red')?.value + ';';
        themeStyle += '--yellow: ' + this.newThemeFormGroup.get('yellow')?.value + ';';
        themeStyle += '--orange: ' + this.newThemeFormGroup.get('orange')?.value + ';';
        themeStyle += '--violet: ' + this.newThemeFormGroup.get('violet')?.value + ';';
        themeStyle += '--cyan: ' + this.newThemeFormGroup.get('cyan')?.value + ';';
        themeStyle += '--green: ' + this.newThemeFormGroup.get('green')?.value + ';';
        themeStyle += '--magenta: ' + this.newThemeFormGroup.get('magenta')?.value + ';';
        themeStyle += '--blue: ' + this.newThemeFormGroup.get('blue')?.value + ';';

        // Border
        themeStyle += '--border-radius: ' + this.newThemeFormGroup.get('borderRadius')?.value + ';';

        const borderThickness = this.newThemeFormGroup.get('borderThickness')?.value;
        const borderType = this.newThemeFormGroup.get('borderType')?.value;
        const borderColor = this.newThemeFormGroup.get('borderColor')?.value;

        themeStyle += `--border: ${borderThickness} ${borderType} ${borderColor}` + ';';

        themeStyle += '--sidebar-left-padding: ' + this.newThemeFormGroup.get('sideBarLeftPadding')?.value + ';';
        themeStyle += '--sidebar-top-padding: ' + this.newThemeFormGroup.get('sideBarTopPadding')?.value + ';';
        themeStyle += '--sidebar-right-padding: ' + this.newThemeFormGroup.get('sideBarRightPadding')?.value + ';';
        themeStyle += '--sidebar-bottom-padding: ' + this.newThemeFormGroup.get('sideBarBottomPadding')?.value + ';';
        themeStyle += '--content-right-padding: ' + this.newThemeFormGroup.get('contentRightPadding')?.value + ';';
        themeStyle += '--content-top-padding: ' + this.newThemeFormGroup.get('contentTopPadding')?.value + ';';
        themeStyle += '--content-bottom-padding: ' + this.newThemeFormGroup.get('contentBottomPadding')?.value + ';';

        theme.style = themeStyle;

        console.log(theme)
    }
}

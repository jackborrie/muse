import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationStart, Router, RouterOutlet}                             from '@angular/router';
import {ThemeService}                                                      from "./services/theme.service";
import {Theme}                                                             from "./models/theme";
import {CommonModule, NgIf, NgStyle}                                       from "@angular/common";
import {SidebarComponent}                                                  from "./components/sidebar/sidebar.component";
import {AuthenticationService}                                             from "./services/authentication.service";
import {Subscription}                                                      from "rxjs";
import {HeaderComponent}                                                   from "./components/header/header.component";
import {DropdownChangeInterface, DropdownService} from "./services/dropdown.service";
import {MuseTemplateDirective}                    from "./directives/muse-template.directive";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgStyle,
        SidebarComponent,
        HeaderComponent,
        NgIf,
        MuseTemplateDirective,
        CommonModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

    @ViewChild('dropdownContainer')
    protected dropdownContainer!: ElementRef;

    protected currentTheme: Theme | null = null;
    protected isLoggedIn = false;

    protected dropdown: DropdownChangeInterface | null = null;

    private _subscriptions: Subscription = new Subscription();

    public constructor(
        private _themes: ThemeService,
        private _authService: AuthenticationService,
        private _dropDown: DropdownService,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this._themes.$onThemeChanged
            .subscribe(theme => {
                this.currentTheme = theme;
            });

        this._themes.fetchAllThemes();

        this._themes.initialThemeLoad();

        const authSub = this._authService.$onIsLoggedInChanged
            .subscribe(isLoggedIn => {
                this.isLoggedIn = isLoggedIn;

                // if (!this.isLoggedIn) {
                //     //
                // }
            });

        this._subscriptions.add(authSub);

        const dropdownSub = this._dropDown.$onDropdownChanged
            .subscribe(template => {
                this.dropdown = template;
            })

        this._subscriptions.add(dropdownSub);

        this._router.events.subscribe(event => {
            if (!(event instanceof NavigationStart)) {
                return;
            }

            this._dropDown.clearDropdown();
        })

        this._authService.attemptLogin();
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }

    @HostListener('window:click', ['$event.target'])
    public onClick(target: EventTarget) {
        if (this.dropdownContainer != null && this.dropdownContainer.nativeElement.contains(target)) {
            this._dropDown.wasDropdownClicked(true);
            return;
        }

        this._dropDown.wasDropdownClicked(false);
    }

    protected getDropdownPosition() {
        if (this.dropdown == null) {
            return null;
        }
        return {
            top: this.dropdown.position.top,
            right: this.dropdown.position.right,
            bottom: this.dropdown.position.bottom,
            left: this.dropdown.position.left
        }
    }
}

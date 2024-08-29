import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ThemeService} from "./services/theme.service";
import {Theme} from "./models/theme";
import {NgStyle} from "@angular/common";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {AuthenticationService} from "./services/authentication.service";
import {Subscription} from "rxjs";
import {BookService}                  from "./services/book.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgStyle, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

    protected currentTheme: Theme | null = null;
    protected isLoggedIn: boolean = false;

    private _subscriptions: Subscription = new Subscription();

    public constructor(
        private _themes: ThemeService,
        private _authService: AuthenticationService,
        private _books: BookService
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

                if (!this.isLoggedIn) {

                }
            });

        this._authService.attemptLogin();

        this._subscriptions.add(authSub);

        this._books.getBooks().subscribe(data => {
            console.log(data);
        })
    }

    ngOnDestroy() {
        this._subscriptions.unsubscribe();
    }
}

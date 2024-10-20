import {Component, OnDestroy, OnInit} from '@angular/core';
import {SectionComponent}             from "../../components/section/section.component";
import {Subscription}                 from "rxjs";
import {AuthenticationService}        from "../../services/authentication.service";
import {NgForOf, NgIf}                from "@angular/common";
import {BookComponent}                from "../../components/book/book.component";
import {BookService}                  from "../../services/book.service";
import {Book}                         from "../../models/book";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        SectionComponent,
        NgIf,
        BookComponent,
        NgForOf
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

    protected isLoggedIn = false;
    protected books: Book[] = [];

    private _subscriptions: Subscription = new Subscription();

    public constructor(
        private _authentication: AuthenticationService,
        private _book: BookService
    ) {
    }

    ngOnInit(): void {
        const authenticationSubject = this._authentication.$onIsLoggedInChanged
            .subscribe(result => {
                this.isLoggedIn = result;
            })

        this._subscriptions.add(authenticationSubject);

        this._book.getBooks(0, 20, 'created_date', 'desc')
            .subscribe(book => {
                this.books = book.data;
            });
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}

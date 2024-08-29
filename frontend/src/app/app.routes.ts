import { Routes } from '@angular/router';
import {LoginComponent} from "./views/login/login.component";
import {DashboardComponent} from "./views/dashboard/dashboard.component";
import {BooksComponent} from "./views/books/books.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'books',
        component: BooksComponent
    }
];

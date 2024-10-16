import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user";
import {LoginResult} from "../models/login-result";
import moment, {Moment} from "moment";
import {BehaviorSubject, Subject} from "rxjs";
import {Router}                          from "@angular/router";
import {WebsocketsService}               from "./websockets.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private _userToken: any;
    private _accessToken: string | null = null;
    private _refreshToken: string | null = null;
    private _expiresIn: number = 0;
    private _websocketToken: string | null = null;

    private _expiryDate: Moment | null = null;

    public $onIsLoggedInChanged: Subject<boolean> = new BehaviorSubject(false);
    public $onGotWebsocketToken: Subject<string> = new BehaviorSubject('');

    public get isAuthenticated () {
        return this._accessToken != null;
    }

    constructor(
        private _httpClient: HttpClient,
        private _router: Router,
        private _websocket: WebsocketsService
    ) {
    }

    public register (user: User) {
        this._httpClient.post<User>('http://localhost:5158/register', user)
            .subscribe((result: User) => {
                console.log(result);
            })
    }

    public login (user: User) {
        this._httpClient.post<LoginResult>('http://localhost:5158/login', user)
            .subscribe((result: LoginResult) => {
                this._accessToken = result.accessToken;
                this._refreshToken = result.refreshToken;
                this._expiresIn = result.expiresIn;

                this._expiryDate = moment().add(this._expiresIn, "seconds");

                this._storeDetails();

                this.$onIsLoggedInChanged.next(this.isAuthenticated);

                this._fetchAuthData();
            })
    }

    private _fetchAuthData () {
        var headers = new HttpHeaders();
        headers = headers.append('Authorization', `Bearer ${this.getAccessToken()}`)
        this._httpClient.get<any>('http://localhost:5158/api/authentication/socket', {headers: headers})
            .subscribe((data: any) => {

                if (data == null) {
                    return;
                }
                this.$onGotWebsocketToken.next(data.token);
                localStorage.setItem('websocket_token', data.token);

                this._websocket.sendMessage(data.token);
            }, err => {
                console.log(err);
            });
    }

    private _storeDetails () {
        if (!this.isAuthenticated) {
            return;
        }

        localStorage.setItem('access_token', this._accessToken!);

        localStorage.setItem('refresh_token', this._refreshToken + '');

        if (this._expiryDate == null) {
            return;
        }

        localStorage.setItem('expiry_date', this._expiryDate.format());
    }


    public attemptLogin () {
        this._accessToken = localStorage.getItem('access_token');
        this._refreshToken = localStorage.getItem('refresh_token');
        this._websocketToken = localStorage.getItem('websocket_token');
        let expiryDate = localStorage.getItem('expiry_date');

        if (!this.isAuthenticated) {
            this._router.navigate(['login']);
            return;
        }

        this._expiryDate = moment(expiryDate);

        let now = moment();

        if (now.isAfter(this._expiryDate)) {
            this.reattempt();
            return;
        }

        if (this._websocketToken != null) {
            this._websocket.sendMessage(this._websocketToken);
        }

        this.$onIsLoggedInChanged.next(this.isAuthenticated);
    }

    public reattempt () {
        if (!this.isAuthenticated || !this._refreshToken) {
            return;
        }

        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + this._accessToken);
        headers = headers.append('Content-Type', 'application/json');
        // headers =

        this._httpClient.post<LoginResult>('http://localhost:5158/refresh', {refreshToken: this._refreshToken}, {headers: headers})
            .subscribe(result => {
                this._accessToken = result.accessToken;
                this._refreshToken = result.refreshToken;
                this._expiresIn = result.expiresIn;

                this._expiryDate = moment().add(this._expiresIn, "seconds");

                this._storeDetails();
                this.$onIsLoggedInChanged.next(this.isAuthenticated);
            }, () => {
                this.logout();
            })
    }

    public getAccessToken (): string | null {
        return this._accessToken;
    }

    public logout () {
        localStorage.clear();
        this._router.navigate(['login']);
        this._accessToken = null;
        this._expiresIn = 0;
        this._refreshToken = null;
        this._websocketToken = null;
        this.$onIsLoggedInChanged.next(this.isAuthenticated);
    }
}

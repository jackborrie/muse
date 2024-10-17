import {Injectable}              from '@angular/core';
import {HttpClient, HttpHeaders}            from '@angular/common/http';
import {catchError, EMPTY, map, Observable} from 'rxjs';
import {Model}                              from '../models/model';
import {FilteredData}            from "../models/filtered-data";
import {AuthenticationService} from "./authentication.service";

export type ModelConstructor<T> = new () => T;

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    private _baseUrl = 'http://localhost:5158';

    constructor(
        private _httpClient: HttpClient,
        private _auth: AuthenticationService
    ) {
    }

    public get<T extends Model>(route: string, model: ModelConstructor<T>, headers: HttpHeaders | null): Observable<T> {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        headers = this._addAuthenticationHeaders(headers);

        return this._httpClient.get(this._baseUrl + '/' + route, {headers: headers}).pipe(
            map(data => {
                const m = new model();

                m.serialise(data);

                return m;
            }, catchError((e) => {
                if (e.status == 401) {
                    // Unauthorized
                    this._auth.logout();

                    console.log('test');
                }
                return EMPTY;
            }))
        );
    }

    public getAll<T extends Model>(route: string, model: ModelConstructor<T>, headers: HttpHeaders | null = null): Observable<FilteredData<T>> {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        headers = this._addAuthenticationHeaders(headers);

        return this._httpClient.get<FilteredData<T>>(this._baseUrl + '/' + route, {headers: headers})
            .pipe(
                map(filteredData => {
                    if (filteredData.data.length == 0) {
                        return filteredData;
                    }

                    const outputList: T[] = [];

                    for (const d of filteredData.data) {
                        const m = new model();
                        m.serialise(d);

                        outputList.push(m);
                    }

                    filteredData.data = outputList;

                    //@ts-expect-error Nothing
                    filteredData.totalPages = filteredData['total_pages'];
                    //@ts-expect-error Nothing
                    delete filteredData['total_pages'];

                    return filteredData;
                }), catchError((e) => {
                    if (e.status == 401) {
                        // Unauthorized
                        this._auth.logout();
                    }
                    return EMPTY
                })
            );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public post(route: string, body: Record<string, any> | null, headers?: HttpHeaders) {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        headers = this._addAuthenticationHeaders(headers);

        return this._httpClient.post(this._baseUrl + '/' + route, body, {headers: headers})
            .pipe (
                catchError((e) => {
                    if (e.status == 401) {
                        // Unauthorized
                        this._auth.logout();
                    }
                    return EMPTY;
                })
            );
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public put(route: string, body: Record<string, any> | null, headers?: HttpHeaders) {
        if (headers == null) {
            headers = new HttpHeaders()
        }

        headers = this._addAuthenticationHeaders(headers);

        if (body != null) {
            const keys = Object.keys(body);
            for (const key of keys) {
                console.log(`${key}: ${body[key]}`)
            }
        }

        return this._httpClient.put(this._baseUrl + '/' + route, body, {headers: headers})
            .pipe (
                catchError((e) => {
                    if (e.status == 401) {
                        // Unauthorized
                        this._auth.logout();
                    }
                    return EMPTY;
                })
            );
    }

    public delete(route: string, headers?: HttpHeaders) {
        if (headers == null) {
            headers = new HttpHeaders()
        }

        headers = this._addAuthenticationHeaders(headers);

        return this._httpClient.delete(this._baseUrl + '/' + route, {headers: headers})
            .pipe (
                catchError((e) => {
                    if (e.status == 401) {
                        // Unauthorized
                        this._auth.logout();
                    }
                    return EMPTY;
                })
            );
    }

    public download (route: string) {
        let headers = new HttpHeaders();

        headers = this._addAuthenticationHeaders(headers);

        return this._httpClient.get(this._baseUrl + '/' + route, { responseType: 'blob', headers: headers })
            .pipe (
                catchError((e) => {
                    if (e.status == 401) {
                        // Unauthorized
                        this._auth.logout();
                    }
                    return EMPTY;
                })
            );
    }

    private _addAuthenticationHeaders (headers: HttpHeaders): HttpHeaders {
        if (!this._auth.isAuthenticated) {
            return headers;
        }

        return headers.append('Authorization', `Bearer ${this._auth.getAccessToken()}`);
    }
}

import {Injectable}              from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable}         from 'rxjs';
import {Model}                   from '../models/model';
import {FilteredData}            from "../models/filtered-data";

export type ModelConstructor<T> = new () => T;

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    private _baseUrl: string = 'http://localhost:5001';

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    public get<T extends Model>(route: string, model: ModelConstructor<T>, headers: HttpHeaders | null): Observable<T> {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        return this._httpClient.get(this._baseUrl + '/' + route, {headers: headers}).pipe(
            map(data => {
                const m = new model();

                m.serialise(data);

                return m;
            })
        );
    }

    public getAll<T extends Model>(route: string, model: ModelConstructor<T>, headers: HttpHeaders | null): Observable<FilteredData<T>> {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        return this._httpClient.get<FilteredData<T>>(this._baseUrl + '/' + route, {headers: headers})
            .pipe(
                map(filteredData => {
                    if (filteredData.data.length == 0) {
                        return filteredData;
                    }

                    let outputList: T[] = [];

                    for (let d of filteredData.data) {
                        const m = new model();
                        m.serialise(d);

                        outputList.push(d);
                    }

                    filteredData.data = outputList;

                    return filteredData;
                })
            );
    }

    public post(route: string, body: { [key: string]: any } | null, headers?: HttpHeaders) {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        return this._httpClient.post(this._baseUrl + '/' + route, body, {headers: headers});
    }

    public put(route: string, body: { [key: string]: any } | null, headers?: HttpHeaders) {
        return this._httpClient.put(this._baseUrl + '/' + route, body, {headers: headers});
    }

    public delete(route: string, headers?: HttpHeaders) {
        if (headers == null) {
            headers = new HttpHeaders();
        }

        return this._httpClient.delete(this._baseUrl + '/' + route, {headers: headers});
    }

    public download (route: string) {
        return this._httpClient.get(this._baseUrl + '/' + route, { responseType: 'blob' });
    }
}

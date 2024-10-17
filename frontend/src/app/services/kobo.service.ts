import {Injectable}     from '@angular/core';
import {RequestService} from "./request.service";
import {Kobo}           from "../models/kobo";
import {Observable}     from "rxjs";
import {HttpHeaders}    from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class KoboService {

    constructor(
        private _request: RequestService
    ) {
    }

    public getKobos (page = 0, pageSize = 25, sortBy: string | null = null, sortDirection: string | null = null) {
        const header = new HttpHeaders();
        let queryParams = `page=${page}`;
        queryParams += `&pageSize=${pageSize}`;

        if (sortBy != null) {
            queryParams += `&sortBy=${sortBy}`;
        }

        if (sortDirection != null) {
            queryParams += `&sortDirection=${sortDirection}`;
        }
        return this._request.getAll('api/kobo?' + queryParams, Kobo, header);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public createKobo (kobo: Kobo): Observable<any> {
        return this._request.post('api/kobo', kobo);
    }

    public updateKobo (kobo: Kobo) {
        return this._request.put(`api/kobo/${kobo.id}`, kobo);
    }

    public deleteKobo (koboId: string) {
        return this._request.delete(`api/kobo/${koboId}`);
    }
 }

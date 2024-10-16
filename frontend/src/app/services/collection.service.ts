import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {HttpHeaders} from "@angular/common/http";
import {Kobo} from "../models/kobo";
import {Collection} from "../models/collection";

@Injectable({
    providedIn: 'root'
})
export class CollectionService {

    constructor(
        private _request: RequestService
    ) {
    }

    public getAll (page: number = 0, pageSize: number = 25, sortBy: string | null = null, sortDirection: string | null = null) {
        var header = new HttpHeaders();
        var queryParams = `page=${page}`;
        queryParams += `&pageSize=${pageSize}`;

        if (sortBy != null) {
            queryParams += `&sortBy=${sortBy}`;
        }

        if (sortDirection != null) {
            queryParams += `&sortDirection=${sortDirection}`;
        }
        return this._request.getAll('api/collections', Collection, header);
    }
}

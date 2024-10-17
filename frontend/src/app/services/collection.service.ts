import {Injectable}     from '@angular/core';
import {RequestService} from "./request.service";
import {HttpHeaders}    from "@angular/common/http";
import {Collection}     from "../models/collection";

@Injectable({
    providedIn: 'root'
})
export class CollectionService {

    constructor(
        private _request: RequestService
    ) {
    }

    public getAll(page = 0, pageSize = 25, sortBy: string | null = null, sortDirection: string | null = null) {
        const header = new HttpHeaders();
        let queryParams = `page=${page}`;
        queryParams += `&pageSize=${pageSize}`;

        if (sortBy != null) {
            queryParams += `&sortBy=${sortBy}`;
        }

        if (sortDirection != null) {
            queryParams += `&sortDirection=${sortDirection}`;
        }
        return this._request.getAll('api/collections?' + queryParams, Collection, header);
    }
}

import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {HttpHeaders} from "@angular/common/http";
import {Book} from "../models/book";

@Injectable({
    providedIn: 'root'
})
export class BookService {

    constructor(private _request: RequestService) {
    }

    public uploadBook(file: File) {
        let formData:FormData = new FormData();
        formData.append('file', file, file.name)

        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');

        return this._request.post('api/books', formData, headers);
    }

    public getBooks (page: number = 0, pageSize: number = 25, sortBy: string | null = null, sortDirection: string | null = null) {
        var header = new HttpHeaders();
        var queryParams = `page=${page}`;
        queryParams += `&pageSize=${pageSize}`;

        if (sortBy != null) {
            queryParams += `&sortBy=${sortBy}`;
        }

        if (sortDirection != null) {
            queryParams += `&sortDirection=${sortDirection}`;
        }
        return this._request.getAll<Book>(`api/books?${queryParams}`, Book, header);
    }
}

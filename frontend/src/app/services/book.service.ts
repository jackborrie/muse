import {Injectable} from '@angular/core';
import {RequestService} from "./request.service";
import {HttpHeaders} from "@angular/common/http";

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
}

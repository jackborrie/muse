import {Injectable} from '@angular/core';
import {webSocket}  from "rxjs/webSocket";

@Injectable({
    providedIn: 'root'
})
export class WebsocketsService {

    private readonly URL = 'ws://localhost:5158/api/kobo/ws';
    private websocketSubject = webSocket(this.URL);
    public $webSocket = this.websocketSubject.asObservable();

    constructor() {
    }

    public sendMessage (value: string) {
        value = value.replaceAll('"', '');

        this.websocketSubject.next(value);
    }
}

import {Injectable}    from '@angular/core';
import {webSocket}     from "rxjs/webSocket";
import {interval, map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class WebsocketsService {

    private readonly URL = 'ws://localhost:5158/api/kobo/ws';
    private websocketSubject = webSocket(this.URL);
    public $webSocket = this.websocketSubject.asObservable()
        .pipe(
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            map((data: any) => {
                try {
                    return JSON.parse(data);
                } catch {
                    return data;
                }
            })
        );

    constructor() {
        interval(10000)
            .subscribe(() => {
                this.sendMessage('fetch');
            });
    }

    public sendMessage(value: string) {
        value = value.replaceAll('"', '');

        this.websocketSubject.next(value);
    }
}

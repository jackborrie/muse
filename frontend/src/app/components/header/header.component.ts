import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebsocketsService}   from "../../services/websockets.service";
import {retry, Subscription} from "rxjs";
import {Kobo}                         from "../../models/kobo";
import {NgForOf}                      from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
    imports: [
        NgForOf
    ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();

    protected kobos: Kobo[] = [];

    public constructor(
        private _websocket: WebsocketsService
    ) {
    }

    public ngOnInit() {
        const webSocketSub = this._websocket.$webSocket
            .pipe(
                retry({delay: 5_000})
            )
            .subscribe((value) => {
                if (value.kobos != null) {
                    this.kobos = value.kobos;
                    console.log(this.kobos);
                }
            });

        this.subscriptions.add(webSocketSub);
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    protected getStatusClass (status: string | null): string {
        if (status == null) {
            // Never been pinged.
            return 'out-of-date';
        }

        return status;
    }

}

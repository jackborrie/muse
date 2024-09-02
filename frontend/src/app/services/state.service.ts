import {Injectable}             from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StateService {

    private _currentSidebarHeight: number = 0;
    public $onSidebarHeightChanged: Subject<number> = new BehaviorSubject(this._currentSidebarHeight);

    constructor() {

    }

    public setHeight (height: number) {
        this._currentSidebarHeight = height;
        this.$onSidebarHeightChanged.next(this._currentSidebarHeight);
    }
}

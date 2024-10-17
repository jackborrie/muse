import {Injectable}             from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StateService {

    private _currentSidebarHeight = 0;
    public $onSidebarHeightChanged: Subject<number> = new BehaviorSubject(this._currentSidebarHeight);

    public setHeight (height: number) {
        this._currentSidebarHeight = height;
        this.$onSidebarHeightChanged.next(this._currentSidebarHeight);
    }
}

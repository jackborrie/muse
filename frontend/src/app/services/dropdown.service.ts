import {EventEmitter, Injectable, TemplateRef} from '@angular/core';

export interface DropdownChangeInterface {
    template: TemplateRef<any>,
    position: {
        top?: string,
        right?: string,
        bottom?: string,
        left?: string
    }
}

@Injectable({
    providedIn: 'root'
})
export class DropdownService {

    private _dropdownTemplate:DropdownChangeInterface | null = null
    public $onDropdownChanged: EventEmitter<DropdownChangeInterface | null> = new EventEmitter<DropdownChangeInterface | null>();

    private _buttonNotClicked: boolean = false;
    private _initial: boolean = true;
    private _dropdownNotClicked: boolean = false;

    constructor() {
    }

    public setDropdown (template: DropdownChangeInterface | null) {
        this._dropdownTemplate = template;
        this.$onDropdownChanged.next(this._dropdownTemplate);
    }

    public setButtonNotClicked() {
        this._buttonNotClicked = true;
        this.handleDropdownState();
    }

    public setDropdownNotClicked () {
        this._dropdownNotClicked = true;
        this.handleDropdownState();
    }

    public handleDropdownState () {
        if (this._initial) {
            this._initial = false;
            return;
        }

        console.log(this._dropdownNotClicked, this._buttonNotClicked)
        if (!this._dropdownNotClicked || !this._buttonNotClicked ) {
            // assume click
            this._dropdownNotClicked = false;
            this._buttonNotClicked = false;
            console.log(this._dropdownNotClicked, this._buttonNotClicked)
            return;
        }
    }
}

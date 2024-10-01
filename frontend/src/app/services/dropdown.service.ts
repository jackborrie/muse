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

    constructor() {
    }

    public setDropdown (template: DropdownChangeInterface | null) {
        this._dropdownTemplate = template;
        this.$onDropdownChanged.next(this._dropdownTemplate);
    }
}

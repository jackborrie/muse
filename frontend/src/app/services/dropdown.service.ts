import {EventEmitter, Injectable, TemplateRef} from '@angular/core';
import {DropdownPosition}                      from "../components/dropdown/dropdown.component";

export interface DropdownChangeInterface {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    template: TemplateRef<any>,
    position: {
        top?: string,
        right?: string,
        bottom?: string,
        left?: string
    },
    class: DropdownPosition
}

@Injectable({
    providedIn: 'root'
})
export class DropdownService {

    private _dropdownTemplate: DropdownChangeInterface | null = null
    public $onDropdownChanged: EventEmitter<DropdownChangeInterface | null> = new EventEmitter<DropdownChangeInterface | null>();

    private _wasButtonClicked: boolean | null = null;
    private _wasDropdownClicked: boolean | null = null;

    public setDropdown(template: DropdownChangeInterface | null) {
        this._dropdownTemplate = template;
        this.$onDropdownChanged.next(this._dropdownTemplate);
    }

    public wasButtonClicked(clicked: boolean) {
        this._wasButtonClicked = clicked;
        this.handleDropdownState();
    }

    public wasDropdownClicked(clicked: boolean) {
        this._wasDropdownClicked = clicked;
        this.handleDropdownState();
    }

    public handleDropdownState() {
        if (this._wasDropdownClicked == null || this._wasButtonClicked == null) {
            return;
        }

        if (this._wasButtonClicked || this._wasDropdownClicked) {
            this._wasDropdownClicked = null;
            this._wasButtonClicked = null;
            return;
        }

        this._dropdownTemplate = null;
        this.$onDropdownChanged.next(this._dropdownTemplate);
        this._wasDropdownClicked = null;
        this._wasButtonClicked = null;
    }

    public clearDropdown() {
        this._dropdownTemplate = null;
        this.$onDropdownChanged.next(this._dropdownTemplate);
    }
}

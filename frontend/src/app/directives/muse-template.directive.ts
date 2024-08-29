import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[mTemplate]',
  standalone: true
})
export class MuseTemplate {

    @Input('mTemplate') name!: string;

    constructor (public template: TemplateRef<any>) {
    }

    getType(): string {
        return this.name;
    }

}

import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[mTemplate]',
  standalone: true
})
export class MuseTemplateDirective {

    @Input('mTemplate') name!: string;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    constructor (public template: TemplateRef<any>) {
    }

    getType(): string {
        return this.name;
    }

}

import {Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[cTemplate]',
  standalone: true
})
export class CompanionTemplate {

    @Input('cTemplate') name!: string;

    constructor (public template: TemplateRef<any>) {
    }

    getType(): string {
        return this.name;
    }

}

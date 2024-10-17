import {MuseTemplateDirective}  from "../directives/muse-template.directive";
import {QueryList, TemplateRef} from "@angular/core";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export function getTemplate(templates: QueryList<MuseTemplateDirective>, columnName: string): TemplateRef<any> | null {
    let template = null;
    templates.forEach(item => {
        if (item.getType() === columnName) {
            template = item.template;
            return;
        }
    });

    return template;
}

import {MuseTemplate}           from "../directives/muse-template.directive";
import {QueryList, TemplateRef} from "@angular/core";

export function getTemplate(templates: QueryList<MuseTemplate>, columnName: string): TemplateRef<any> | null {
    let template = null;
    templates.forEach(item => {
        if (item.getType() === columnName) {
            template = item.template;
            return;
        }
    });

    return template;
}

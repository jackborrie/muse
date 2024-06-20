import {ElementRef} from "@angular/core";

export function clearChildren (element: ElementRef<any>) {
    const childElements = element.nativeElement.children;
    for (let child of childElements) {
        element.nativeElement.removeChild(child);
    }
}

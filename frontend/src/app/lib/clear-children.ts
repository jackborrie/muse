import {ElementRef} from "@angular/core";

export function clearChildren (element: ElementRef) {
    const childElements = element.nativeElement.children;
    for (const child of childElements) {
        element.nativeElement.removeChild(child);
    }
}

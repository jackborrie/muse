import {Model} from "./model";

export class Theme extends Model {
    id: string | null = null
    name: string | null = null;
    className: string | null = null;
    style: string | null = null;
}

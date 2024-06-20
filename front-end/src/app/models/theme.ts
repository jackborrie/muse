import {Model} from "./model";

export class Theme extends Model{
    name: string | null = null;
    className: string | null = null;
    style: string | null = null;
}

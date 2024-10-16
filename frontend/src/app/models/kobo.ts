import {Model} from "./model";

export class Kobo extends Model {
    public id: string | null = null;
    public name: string | null = null;
    public getPublic: boolean | null = null;
    public collectionId: string | null = null;
}

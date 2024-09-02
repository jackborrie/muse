import {Model} from "./model";

export class Book extends Model {
    public id: string | null = null;
    public title: string | null = null;
    public isbn: string | null = null;
    public description: string | null = null;
    public hasCover: boolean = false;
    public hasInitialSearch: boolean = false;
    public read: number = 0;
    public ownerId: number | null = null;
    public public: boolean = false;
    public creationDate: Date | null = null;

}

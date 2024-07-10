import { camelCase } from 'lodash';

export abstract class Model {
    // Jesse's letter: qaassszdfxdfgbvcvb

    public serialise (json: {[key: string]: any}) {
        let keys = Object.keys(json);

        for (let key of keys) {
            // @ts-ignore
            this[camelCase(key)] = json[key];
        }
    }
}
export function activator<T extends Model>(type: { new(): T ;} ): T {
    return new type();
}

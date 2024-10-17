import { camelCase } from 'lodash';

export abstract class Model {
    // Jesse's letter: qaassszdfxdfgbvcvb

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    public serialise (json: Record<string, any>) {
        const keys = Object.keys(json);

        for (const key of keys) {
            // @ts-expect-error Nothing
            this[camelCase(key)] = json[key];
        }
    }
}
// export function activator<T extends Model>(type: { new(): T ;} ): T {
//     return new type();
// }

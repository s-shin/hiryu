export declare function flipObject(obj: any): any;
export declare type DeepReadonly<T> = T extends any[] ? DeepReadonlyArray<T[number]> : T extends object ? DeepReadonlyObject<T> : T;
export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {
}
export declare type DeepReadonlyObject<T> = T & {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

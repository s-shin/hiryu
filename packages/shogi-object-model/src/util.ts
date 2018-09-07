export function flipObject(obj: any) {
  const r: any = {};
  for (const k of Object.keys(obj)) {
    r[obj[k]] = k;
  }
  return r;
}

//---

export type DeepReadonly<T> =
  T extends any[] ? DeepReadonlyArray<T[number]> :
  T extends object ? DeepReadonlyObject<T> :
  T;

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

export type DeepReadonlyObject<T> = T & { readonly [P in keyof T]: DeepReadonly<T[P]> };

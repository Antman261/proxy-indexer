import { Captor, IndexOptions } from './common';

type IndexableObj = Record<string, unknown>;

export type HashIndexOptions = IndexOptions;
export type HashIndex<T extends IndexableObj, TargetProp extends keyof T> = {
  get: (value: T[TargetProp]) => Set<T> | undefined;
};

export function createHashIndex<T extends IndexableObj>(
  opts: HashIndexOptions
): [HashIndex<T, typeof opts['targetProperty']>, Captor<T>] {
  const indexData = new Map<T[typeof opts['targetProperty']], Set<T>>();
  const { targetProperty } = opts;

  const captorFunction: Captor<T> = (obj) => {
    const proxy = new Proxy(obj, {
      set(target: T, propName: never, newValue: any): boolean {
        // @ts-ignore
        const isUpdating =
          propName === targetProperty && target[propName] !== newValue;
        if (isUpdating) {
          const oldSpecifier = target[propName] as never;
          const oldIndexValues = indexData.get(oldSpecifier);
          if (!oldIndexValues) {
            throw new Error(
              `Object was not captured correctly, missing index for ${oldSpecifier}`
            );
          }
          oldIndexValues.delete(proxy);

          insertIntoIndex(newValue, proxy, indexData);
        }
        // @ts-ignore
        target[propName] = newValue;
        return true;
      },
    });
    const specifier = obj[targetProperty] as never;
    insertIntoIndex(specifier, proxy, indexData);

    return proxy;
  };

  return [
    {
      get: (val) => indexData.get(val),
    },
    captorFunction,
  ];
}

const insertIntoIndex = <T extends IndexableObj>(
  specifier: T[string],
  target: T,
  index: Map<T[string], Set<T>>
): void => {
  const hasExistingIndex = index.has(specifier);
  if (!hasExistingIndex) {
    index.set(specifier, new Set<T>());
  }
  const newIndexValues = index.get(specifier);
  newIndexValues?.add(target);
};

import {
  Captor,
  IndexableObj,
  IndexOptions,
  TargetProperties,
  TargetProperty,
} from './common';

export type HashIndexOptions = IndexOptions;
export type HashIndex<
  T extends IndexableObj,
  TargetProp extends Array<keyof T>
> = Record<
  string,
  {
    get: (value: T[TargetProp[0]]) => Set<T> | undefined;
  }
>;

export function createHashIndex<T extends IndexableObj>(
  opts: HashIndexOptions
): [HashIndex<T, TargetProperties>, Captor<T>] {
  const { targetProperties } = opts;
  const indexes = new Map<TargetProperty, Map<T[TargetProperty], Set<T>>>();
  targetProperties.forEach((targetProperty) => {
    indexes.set(targetProperty, new Map<T[TargetProperty], Set<T>>());
  });

  const captorFunction: Captor<T> = (obj) => {
    const proxy = new Proxy(obj, {
      set(target: T, propName: never, newValue: any): boolean {
        const isUpdating =
          targetProperties.includes(propName) && target[propName] !== newValue;
        if (isUpdating) {
          const oldSpecifier = target[propName] as never;
          const index = indexes.get(propName);
          if (!index) {
            throw new Error(`Index missing for property [${propName}]`);
          }
          const oldIndexValues = index.get(oldSpecifier);
          if (!oldIndexValues) {
            throw new Error(
              `Object was not captured correctly, missing index for ${propName}:${oldSpecifier}`
            );
          }
          oldIndexValues.delete(proxy);

          insertIntoIndex(newValue, proxy, index);
        }
        // @ts-ignore
        target[propName] = newValue;
        return true;
      },
    });
    targetProperties.forEach((targetProperty) => {
      const specifier = obj[targetProperty] as never;
      const index = indexes.get(targetProperty);
      if (!index) {
        throw new Error(`Index missing for property [${targetProperty}]`);
      }
      insertIntoIndex(specifier, proxy, index);
    });

    return proxy;
  };

  return [
    targetProperties.reduce<HashIndex<T, TargetProperties>>(
      (acc, targetProperty) => {
        acc[`${targetProperty}Index`] = {
          get: (val) => {
            return indexes?.get(targetProperty)?.get(val);
          },
        };
        return acc;
      },
      {}
    ),
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

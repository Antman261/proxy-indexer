import { HashIndex, HashIndexOptions } from './hash';
import {
  Captor,
  IndexableObj,
  TargetProperties,
  TargetProperty,
} from './common';
import { UniqueIndexOptions } from './uniqueHash';

type Options = {
  hash?: HashIndexOptions;
  unique?: UniqueIndexOptions;
};

export function createIndexes<T extends IndexableObj>(
  opts: Options
): [HashIndex<T, TargetProperties>, Captor<T>] {
  const { hash: hashOpts, unique: uniqueOpts } = opts;
  // create the complete list of target properties
  // instantiate the indexes

  const captorFunction: Captor<T> = (obj) => {
    const proxy = new Proxy(obj, {
      set(target: T, propName: never, newValue: any): boolean {
        const isUpdating =
          targetProperties.includes(propName) && target[propName] !== newValue;
        // any update to ANY target property for all indexes
        if (isUpdating) {
          const oldSpecifierValue = target[propName] as never;
          // now call the update handler for each active index
        }
        // @ts-ignore
        target[propName] = newValue;
        return true;
      },
    });
    targetProperties.forEach((targetProperty) => {
      const specifierValue = obj[targetProperty] as never;
      // initial value setter for captured object
    });

    return proxy;
  };

  return [
    targetProperties.reduce<HashIndex<T, TargetProperties>>(
      (acc, targetProperty) => {
        acc[`${targetProperty}Index`] = {
          get: (val) => {
            const returnValue = indexes?.get(targetProperty)?.get(val);
            if (!returnValue) {
              throw new Error('ffs');
            }
            return returnValue;
          },
        };
        return acc;
      },
      {}
    ),
    captorFunction,
  ];
}

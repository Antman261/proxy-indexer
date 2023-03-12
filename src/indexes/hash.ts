import {
  IndexableObj,
  IndexOptions,
  Ingestor,
  MissingIndex,
  MissingIndexValue,
  TargetProperty,
  Updater,
} from './common';

export type HashIndex<T extends IndexableObj> = Record<
  string,
  {
    get: (value: T[string]) => Set<T> | undefined;
  }
>;

export function createHashIndex<T extends IndexableObj>({
  targetProperties,
}: IndexOptions<T>): [HashIndex<T>, Updater<T>, Ingestor<T>] {
  const indexes = initialiseIndex<T>(targetProperties);

  const captureUpdate: Updater<T> = (obj, propName, newValue) => {
    const oldValue = obj[propName] as T[string]; // ts is drunk
    const isUpdating =
      targetProperties.includes(propName) && oldValue !== newValue;
    if (isUpdating) {
      const index = indexes.get(propName);
      if (!index) {
        throw new MissingIndex(`Index missing for property [${propName}]`);
      }
      const oldIndexValues = index.get(oldValue);
      if (!oldIndexValues) {
        throw new MissingIndexValue(
          `Object was not captured correctly, missing index value for ${propName}:${oldValue}`
        );
      }
      oldIndexValues.delete(obj);
      insertIntoIndex(newValue, obj, index);
    }
  };
  const ingestObject: Ingestor<T> = (obj) => {
    targetProperties.forEach((targetProperty) => {
      const specifier = obj[targetProperty] as never;
      const index = indexes.get(targetProperty);
      if (!index) {
        throw new MissingIndex(
          `Index missing for property [${targetProperty}]`
        );
      }
      insertIntoIndex(specifier, obj, index);
    });
  };

  return [
    targetProperties.reduce<HashIndex<T>>((acc, targetProperty) => {
      acc[`${targetProperty}Index`] = {
        get: (val) => {
          return indexes?.get(targetProperty)?.get(val);
        },
      };
      return acc;
    }, {}),
    captureUpdate,
    ingestObject,
  ];
}

function initialiseIndex<T extends IndexableObj>(targetProperties: string[]) {
  const indexes = new Map<TargetProperty, Map<T[TargetProperty], Set<T>>>();
  targetProperties.forEach((targetProperty) => {
    indexes.set(targetProperty, new Map<T[TargetProperty], Set<T>>());
  });
  return indexes;
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

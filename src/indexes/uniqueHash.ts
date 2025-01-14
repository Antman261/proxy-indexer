import {
  Deleter,
  IndexableObj,
  IndexError,
  IndexOptions,
  Ingestor,
  MissingIndex,
  MissingIndexValue,
  TargetProperty,
  Updater
} from './common';

export type UniqueIndex<T extends IndexableObj> = Record<
  string,
  {
    get: (value: T[string]) => T | undefined;
  }
>;

export function createUniqueHashIndex<T extends IndexableObj>({
  targetProperties,
}: IndexOptions<T>): [UniqueIndex<T>, Updater<T>, Ingestor<T>, Deleter<T>] {
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
      const oldIndexValue = index.has(oldValue);
      if (!oldIndexValue) {
        throw new MissingIndexValue(
          `Object was not captured correctly, missing index value for ${propName}:${oldValue}`
        );
      }
      index.delete(oldValue);
      insertIntoIndex(newValue, obj, index, propName);
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
      insertIntoIndex(specifier, obj, index, targetProperty);
    });
  };
  const deleteObject: Deleter<T> = (obj) => {
    targetProperties.forEach((targetProperty) => {
      const specifier = obj[targetProperty] as never;
      const index = indexes.get(targetProperty);
      if (!index) {
        throw new MissingIndex(
          `Index missing for property [${targetProperty}]`
        );
      }
      deleteFromIndex(specifier, index);
    });
  };

  return [
    targetProperties.reduce<UniqueIndex<T>>((acc, targetProperty) => {
      acc[`${targetProperty}Index`] = {
        get: (val) => {
          return indexes?.get(targetProperty)?.get(val);
        },
      };
      return acc;
    }, {}),
    captureUpdate,
    ingestObject,
    deleteObject,
  ];
}

function initialiseIndex<T extends IndexableObj>(targetProperties: string[]) {
  const indexes = new Map<TargetProperty, Map<T[TargetProperty], T>>();
  targetProperties.forEach((targetProperty) => {
    indexes.set(targetProperty, new Map<T[TargetProperty], T>());
  });
  return indexes;
}
const deleteFromIndex = <T extends IndexableObj>(
  specifier: T[string],
  index: Map<T[string], T>
): void => {
  index.delete(specifier);
};
const insertIntoIndex = <T extends IndexableObj>(
  specifier: T[string],
  target: T,
  index: Map<T[string], T>,
  targetProperty: string
): void => {
  const hasExistingIndex = index.has(specifier);
  if (hasExistingIndex) {
    if (target !== index.get(specifier)) {
      throw new UniqueConstraintViolation(
        `Duplicate key value [${specifier}] already exists for property [${targetProperty}]`
      );
    }
  }
  index.set(specifier, target);
};

export class UniqueConstraintViolation extends IndexError {}

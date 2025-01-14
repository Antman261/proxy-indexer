import { createHashIndex, HashIndex } from './hash';
import {
  Captor,
  ConfigurationError,
  Deleter,
  IndexedObj,
  IndexableObj,
  IndexOptions,
  Ingestor,
  Updater,
} from './common';
import { createUniqueHashIndex, UniqueIndex } from './uniqueHash';

type Options<T extends IndexableObj> = {
  hash?: IndexOptions<T>;
  unique?: IndexOptions<T>;
};

type Indexes<T extends IndexableObj> = {
  hash: HashIndex<T>;
  unique: UniqueIndex<T>;
};

export function createIndexes<T extends IndexableObj>(
  opts: Options<T>
): [Indexes<T>, Captor<T>] {
  validateOptions(opts);
  const { hash: hashOpts, unique: uniqueOpts } = opts;

  const [hashIdx, updateInHashIndex, ingestIntoHashIndex, deleteFromHashIndex] =
    hashOpts ? createHashIndex<T>(hashOpts) : [];
  const [
    uniqueIdx,
    updateInUniqueIndex,
    ingestIntoUniqueIndex,
    deleteFromUniqueIndex,
  ] = uniqueOpts ? createUniqueHashIndex<T>(uniqueOpts) : [];

  const updaters = [updateInUniqueIndex, updateInHashIndex].filter<Updater<T>>(
    isNotUndefined
  );
  const ingestors = [ingestIntoUniqueIndex, ingestIntoHashIndex].filter<
    Ingestor<T>
  >(isNotUndefined);
  const deleters = [deleteFromHashIndex, deleteFromUniqueIndex].filter<
    Deleter<T>
  >(isNotUndefined);

  const captureObject: Captor<T> = (obj: T): IndexedObj<T> => {
    const proxy = new Proxy(obj, {
      set(target: T, propName: never, newValue: any): boolean {
        updaters.forEach((updateIndexFunc) =>
          updateIndexFunc(proxy, propName, newValue)
        );
        // @ts-ignore
        target[propName] = newValue;
        return true;
      },
      get(target: T, p: string | symbol): any {
        if (p === 'deleteFromIndex') {
          return () => {
            deleters.forEach((deleteFromIndexFunc) => deleteFromIndexFunc(proxy));
          }
        }
        if (p === 'getTarget') {
          return () => obj;
        }
        if (p === 'isProxy') {
          return true;
        }
        // @ts-ignore
        return target[p];
      }
    }) as IndexedObj<T>;

    ingestors.forEach((ingestIntoIndex) => ingestIntoIndex(proxy));

    return proxy;
  };

  return [{ hash: hashIdx ?? {}, unique: uniqueIdx ?? {} }, captureObject];
}

function isNotUndefined<T>(element: any): element is T {
  return element !== undefined;
}

function validateOptions<T extends IndexableObj>({ hash, unique }: Options<T>) {
  if (hash === undefined || unique === undefined) {
    return;
  }
  const combinedProps = [...hash.targetProperties, ...unique.targetProperties];
  const deDupedProps = new Set(combinedProps);
  if (deDupedProps.size !== combinedProps.length) {
    const sharedProps = combinedProps.filter((prop) => deDupedProps.has(prop));
    throw new ConfigurationError(
      `Properties [${sharedProps}] used for both hash and unique index. A property must only be used in one type of index.`
    );
  }
}

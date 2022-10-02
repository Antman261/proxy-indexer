import { IndexableObj } from './common';

type SortableKey = any;

export const createBinarySearchIndex = <T extends IndexableObj>() => {
  const array: { key: SortableKey; values: T[] }[] = [];
  const addAt = (index: number, key: SortableKey, value: T) => {
    if (!array[index]) {
      array[index] = { key, values: [] };
    }
    array[index].values.push(value);
  };
  const findInsertPosition = (key: SortableKey): number => {
    let low = 0;
    let high = array.length;
    let mid;
    while (low < high) {
      mid = (low + high) >>> 1; // Equivalent to Math.floor((low + high) / 2), but fast
      if (lessThan(array[mid].key, key)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };
  const findKeyPosition = (key: SortableKey): number => {
    const idx = findInsertPosition(key);
    if (array[idx]?.key == key) {
      return idx;
    }
    return -1;
  };
  return {
    set: (key: SortableKey, value: T) => {
      const insertPosition = findInsertPosition(key);
      addAt(insertPosition, key, value);
    },
    get: (key: SortableKey): T[] => array[findKeyPosition(key)]?.values ?? [],
    delete: (key: SortableKey, obj: T): void => {
      const entry = array[findKeyPosition(key)];
      if (entry === undefined) {
        return;
      }
      const objIndex = entry.values.findIndex((item) => item === obj);
      if (objIndex > -1) {
        entry.values.splice(objIndex, 1);
      }
    },
    has: (key: SortableKey, obj: T): boolean => {
      const entry = array[findKeyPosition(key)];
      if (entry === undefined) {
        return false;
      }
      return entry.values.includes(obj);
    },
    range: (fromKey: number, toKey: number): Iterator<T[] | undefined> => {
      let nextKey = fromKey;
      return {
        next() {
          if (nextKey < toKey) {
            let entry = array[findKeyPosition(nextKey)];
            while (entry === undefined && nextKey < toKey) {
              nextKey++;
              entry = array[findKeyPosition(nextKey)];
            }
            return { value: entry.values, done: false };
          }
          const entry = array[findKeyPosition(nextKey)];
          return { value: entry?.values, done: true };
        },
      };
    },
  };
};

function comparer(a: any, b: any) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

function lessThan(a: any, b: any): boolean {
  return comparer(a, b) < 0;
}

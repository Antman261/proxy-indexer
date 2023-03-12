import { IndexableObj, IndexOptions, Ingestor, Updater } from './common';
export declare type HashIndex<T extends IndexableObj> = Record<string, {
    get: (value: T[string]) => Set<T> | undefined;
}>;
export declare function createHashIndex<T extends IndexableObj>({ targetProperties, }: IndexOptions<T>): [HashIndex<T>, Updater<T>, Ingestor<T>];
//# sourceMappingURL=hash.d.ts.map
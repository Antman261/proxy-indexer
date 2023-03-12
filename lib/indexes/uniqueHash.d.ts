import { IndexableObj, IndexError, IndexOptions, Ingestor, Updater } from './common';
export declare type UniqueIndex<T extends IndexableObj> = Record<string, {
    get: (value: T[string]) => T | undefined;
}>;
export declare function createUniqueHashIndex<T extends IndexableObj>({ targetProperties, }: IndexOptions<T>): [UniqueIndex<T>, Updater<T>, Ingestor<T>];
export declare class UniqueConstraintViolation extends IndexError {
}
//# sourceMappingURL=uniqueHash.d.ts.map
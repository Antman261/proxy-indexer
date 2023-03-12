import { HashIndex } from './hash';
import { Captor, IndexableObj, IndexOptions } from './common';
import { UniqueIndex } from './uniqueHash';
declare type Options<T extends IndexableObj> = {
    hash?: IndexOptions<T>;
    unique?: IndexOptions<T>;
};
declare type Indexes<T extends IndexableObj> = {
    hash: HashIndex<T>;
    unique: UniqueIndex<T>;
};
export declare function createIndexes<T extends IndexableObj>(opts: Options<T>): [Indexes<T>, Captor<T>];
export {};
//# sourceMappingURL=createIndexes.d.ts.map
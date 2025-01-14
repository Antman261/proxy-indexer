export declare type IndexableObj = Record<string, unknown>;
export declare type Properties = string[];
export declare type TargetProperty = string;
export declare type IndexOptions<T extends IndexableObj> = {
    targetProperties: Properties;
};
export declare type IndexedObj<T extends IndexableObj> = T & {
    deleteFromIndex: () => void;
    getTarget: () => T;
    isProxy: true;
};
export declare type Captor<T extends IndexableObj> = (obj: T) => IndexedObj<T>;
export declare type Updater<T extends IndexableObj> = (obj: T, propName: string, newValue: T[string]) => void;
export declare type Ingestor<T extends IndexableObj> = (obj: T) => void;
export declare type Deleter<T extends IndexableObj> = (obj: T) => void;
export declare class IndexError extends Error {
}
export declare class MissingIndex extends IndexError {
}
export declare class MissingIndexValue extends IndexError {
}
export declare class ConfigurationError extends IndexError {
}
//# sourceMappingURL=common.d.ts.map
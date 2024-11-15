export type IndexableObj = Record<string, unknown>;

export type Properties = string[];
export type TargetProperty = string;

export type IndexOptions<T extends IndexableObj> = {
  targetProperties: Properties;
};
export type Extension<T extends IndexableObj> = {
  deleteFromIndex: () => void ;
  // It looks like Omit<T & Extension<T>, keyof Extension<T>> might just equal T.
  // But that's not true if T intersects with Extension eg T includes a field called 'deleteFromIndex' or 'getTarget'
  // We could probably guard against this using a conditional type... but let's not get too carried away
  getTarget: () => Omit<T & Extension<T>, keyof Extension<T>>;
};

export type Captor<T extends IndexableObj> = (obj: T) => T & Extension<T>;
export type Updater<T extends IndexableObj> = (
  obj: T,
  propName: string,
  newValue: T[string]
) => void;
export type Ingestor<T extends IndexableObj> = (obj: T) => void;
export type Deleter<T extends IndexableObj> = (obj: T) => void;

export class IndexError extends Error {}
export class MissingIndex extends IndexError {}
export class MissingIndexValue extends IndexError {}
export class ConfigurationError extends IndexError {}

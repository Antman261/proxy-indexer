export type IndexOptions = {
  targetProperty: string;
};

export type Captor<T> = (obj: T) => T;

export type IndexableObj = Record<string, unknown>;

export type TargetProperties = TargetProperty[];
export type TargetProperty = string;

export type IndexOptions = {
  targetProperties: string[];
};

export type Captor<T> = (obj: T) => T;

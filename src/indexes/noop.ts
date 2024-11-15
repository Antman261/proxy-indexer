import {
  Captor,
  Extension,
  IndexableObj,
} from './common';


export function createNoopCaptor<T extends IndexableObj>(): Captor<T> {
  const captureObject: Captor<T> = (obj: T): T & Extension<T> => {
    const extendedObject = Object.assign(obj, {
      deleteFromIndex() {
        // No-op
      },
      getTarget() {
        const {getTarget, deleteFromIndex, ...rest} = extendedObject;
        return rest;
      }
    });

    return extendedObject;
  };

  return captureObject;
}

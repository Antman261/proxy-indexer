import { Captor, IndexableObj, IndexedObj } from './common';


export function createNoopCaptor<T extends IndexableObj>(): Captor<T> {
  return (obj: T): IndexedObj<T> => {
    return Object.assign({}, obj, {
      deleteFromIndex() {
        // No-op
      },
      getTarget() {
        return obj;
      },
      isProxy: true as const,
    });
  };
}

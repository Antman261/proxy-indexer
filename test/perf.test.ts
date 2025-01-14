import { createIndexes } from '../src/indexes/createIndexes';
import { performance } from 'perf_hooks';
import { expect } from 'chai';

type Order = { orderId: string; status: string; cost: number };

describe('Performance tests', function () {
  const [
    {
      hash: { statusIndex: orderStatusIndex },
    },
    captureOrder,
  ] = createIndexes<Order>({
    hash: { targetProperties: ['status'] },
  });
  const statusMap = {
    0: 'PLACED',
    1: 'SHIPPED',
    2: 'DELIVERED',
    3: 'CANCELLED',
  } as const;
  const allObjects = Array.from(
    { length: 125_000 },
    // @ts-ignore
    (_, i) => captureOrder({ num: i, status: statusMap[i % 4] })
  );
  const placed = orderStatusIndex.get('PLACED');
  it('looks up objects more than 1000x faster', () => {
    const t0 = performance.now();
    const shippedOld = Object.values(allObjects).filter(
      ({ status }) => status === 'SHIPPED'
    );
    const t1 = performance.now();
    const shipped = orderStatusIndex.get('SHIPPED');
    const t2 = performance.now();
    const vanillaLookupMs = t1 - t0;
    const indexedLookupMs = t2 - t1;
    const indexImprovementRatio = vanillaLookupMs / indexedLookupMs;
    console.log(`Vanilla lookup: ${vanillaLookupMs}ms`);
    console.log(`Indexed lookup: ${indexedLookupMs}ms`);
    console.log(
      `Index lookups are ${indexImprovementRatio.toFixed(0)} times faster`
    );
    expect(shipped?.size).to.eq(shippedOld.length);
    expect(indexImprovementRatio).to.be.gte(1000); // Assert the index is at least 1,000 times faster
  });
  it('updates are not more than twice as slow', () => {
    const objToUpdate = allObjects[100_000];
    expect(objToUpdate.status).to.eq('PLACED');
    expect(placed?.size).to.eq(31_250);
    const vanillaObjToUpdate = { num: 12345, status: 'PLACED' };
    vanillaObjToUpdate.status = 'CANCELLED'; // Need to perform an update to force v8 to fully allocate the object
    objToUpdate.status = 'CANCELLED';
    const t0 = performance.now();
    vanillaObjToUpdate.status = 'SHIPPED';
    const t1 = performance.now();
    objToUpdate.status = 'SHIPPED';
    const t2 = performance.now();
    const vanillaUpdateMs = t1 - t0;
    const indexedUpdatedMs = t2 - t1;
    const updateSlowdownRatio = indexedUpdatedMs / vanillaUpdateMs;
    console.log(`Vanilla update: ${vanillaUpdateMs}ms`);
    console.log(`Indexed update: ${indexedUpdatedMs}ms`);
    console.log(`Updates are ${updateSlowdownRatio.toFixed(2)} times slower`);
    const { deleteFromIndex, ...objUpdated} = objToUpdate;
    expect(placed?.size).to.eq(31_249);
    expect(objUpdated).to.deep.eq({ num: 100_000, status: 'SHIPPED' });
    expect(updateSlowdownRatio).to.be.lte(2);
  });
});

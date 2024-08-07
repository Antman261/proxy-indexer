import { expect } from 'chai';
import { createIndexes } from '../src/indexes/createIndexes';
import { UniqueConstraintViolation } from '../src/indexes/uniqueHash';

type Order = { orderId: string; status: string; cost: number };

describe('README.md examples', () => {
  const [
    {
      hash: { statusIndex: orderStatusIndex },
      unique: { orderIdIndex },
    },
    captureOrder,
  ] = createIndexes<Order>({
    hash: { targetProperties: ['status'] },
    unique: { targetProperties: ['orderId'] },
  });
  const exampleOrder = captureOrder({
    orderId: '123abc',
    status: 'PLACED',
    cost: 400,
  });
  const placedOrders = orderStatusIndex.get('PLACED');

  it('returns indexed objects from hash index', () => {
    expect(exampleOrder).to.eq(placedOrders?.values().next().value);
  });
  it('updates hash indexes when values change', () => {
    exampleOrder.status = 'SHIPPED';
    const shippedOrders = orderStatusIndex.get('SHIPPED');

    expect(placedOrders?.size).to.eq(0);
    expect(exampleOrder).to.eq(shippedOrders?.values().next().value);
  });
  it('returns indexed object from unique index', () => {
    expect(exampleOrder).to.eq(orderIdIndex.get('123abc'));
  });
  it('updates unique indexes when values change', () => {
    exampleOrder.orderId = '456zyx';
    expect(exampleOrder).to.eq(orderIdIndex.get('456zyx'));
  });
  it('deletes entries from indexes', () => {
    const delOrder =
      captureOrder({
        orderId: '90210',
        status: 'PLACED',
        cost: 120,
      });
    expect(delOrder).to.eq(orderIdIndex.get('90210'));
    delOrder.deleteFromIndex();
    expect(orderIdIndex.get('90210')).to.eq(undefined)
  });
  it('throws when an object is captured that violates a unique constraint', () => {
    captureOrder({
      orderId: '1z2x3c',
      status: 'PLACED',
      cost: 100,
    });
    expect(() => {
      captureOrder({
        orderId: '1z2x3c',
        status: 'PLACED',
        cost: 100,
      });
    }).to.throw(UniqueConstraintViolation);
  });
  it('throws when an object is updated to violate a unique constraint', () => {
    const obj = captureOrder({
      orderId: '234',
      status: 'PLACED',
      cost: 100,
    });
    captureOrder({
      orderId: '345',
      status: 'PLACED',
      cost: 100,
    });
    expect(() => {
      obj.orderId = '345';
    }).to.throw(UniqueConstraintViolation);
  });
});

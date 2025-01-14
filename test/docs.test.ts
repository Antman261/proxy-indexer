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
    const delOrder = captureOrder({
      orderId: '90210',
      status: 'AWAITING_PICKUP',
      cost: 120,
    });

    expect(delOrder).to.eq(
      orderStatusIndex.get('AWAITING_PICKUP')?.values().next().value
    );
    expect(delOrder).to.eq(orderIdIndex.get('90210'));

    delOrder.deleteFromIndex();
    expect(orderIdIndex.get('90210')).to.eq(undefined);
    expect(orderStatusIndex.get('AWAITING_PICKUP')?.size).eq(0);
  });
  it('returns the target object from getTarget, including updates made to the proxied object', () => {
    const order = {
      orderId: '90210',
      status: 'PLACED',
      cost: 120,
    };
    const capturedOrder = captureOrder(order);
    capturedOrder.status = 'DISPATCHED';

    expect(capturedOrder).to.eq(
      orderStatusIndex.get('DISPATCHED')?.values().next().value
    );
    expect(capturedOrder.getTarget()).to.eq(order);
    expect(capturedOrder.getTarget().status).to.eq('DISPATCHED');

    // None of the methods added to extend the proxy should ever be assigned to
    // the target.
    // @ts-expect-error
    expect(capturedOrder.getTarget().deleteFromIndex).to.eq(undefined);
    // @ts-expect-error
    expect(capturedOrder.getTarget().getTarget).to.eq(undefined);
    // @ts-expect-error
    expect(capturedOrder.getTarget().isProxy).to.eq(undefined);
  });
  it('reports its proxy status via isProxy', () => {
    const order = orderStatusIndex.get('SHIPPED')?.values().next().value;
    expect(order.isProxy).to.eq(true);
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

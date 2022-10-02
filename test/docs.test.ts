import { expect } from 'chai';
import { createHashIndex } from '../src/indexes/hash';

type Order = { orderId: string; status: string; cost: number };

describe('README.md examples', () => {
  const [orderStatusIndex, captureOrder] = createHashIndex<Order>({
    targetProperty: 'status',
  });
  const exampleOrder = captureOrder({
    orderId: '123abc',
    status: 'PLACED',
    cost: 400,
  });
  const placedOrders = orderStatusIndex.get('PLACED');

  it('returns indexed objects', () => {
    console.log(placedOrders);
    console.log(exampleOrder);
    expect(exampleOrder).to.eq(placedOrders?.['0']);
  });
  it('updates indexes when values change', () => {
    exampleOrder.status = 'SHIPPED';
    expect(placedOrders?.length).to.eq(0);
    const shippedOrders = orderStatusIndex.get('SHIPPED');
    expect(exampleOrder).to.eq(shippedOrders?.shift());
  });
});

/*
const [orderStatusIndex, captureOrder] = createHashIndex({
  targetProperty: 'status',
});

const exampleOrder = captureOrder({
  orderId: '123abc',
  status: 'PLACED',
  cost: 400,
});

const placedOrders = orderStatusIndex.get('PLACED');
console.log(exampleOrder === placedOrders[0]); // true

exampleOrder.status = 'SHIPPED';

console.log(placedOrders.length); // 0

const shippedOrders = orderStatusIndex.get('SHIPPED');
console.log(exampleOrder === shippedOrders[0]); // true
 */

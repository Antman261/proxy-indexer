# proxy-indexer

Proxy-indexer allows you to easily index collections of mutable objects based on their 
own mutable properties. 

While this is relatively easy to implement yourself for immutable properties, it is challenging 
to keep an index up to date when it is based on a mutable property. Consider, you want to lookup 
a set of orders based on their order status. However, their order status frequently changes. 
Proxy-indexer makes this process transparent via the following API: 

```ts
import { createHashIndex } from 'proxy-indexer';

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
```

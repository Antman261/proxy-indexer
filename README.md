# proxy-indexer

Proxy-indexer allows you to easily index collections of mutable objects based on their 
own mutable properties. 

While this is relatively easy to implement for immutable properties, it is challenging 
to keep an index up to date when it is based on a mutable property. Consider, you want to look up 
a set of orders based on their order status. However, their order status frequently changes. 
Proxy-indexer makes this process transparent via the following API:

```ts
import { createIndexes } from 'proxy-indexer';

const [
  { 
    hash: { statusIndex: orderStatusIndex } 
  }, 
  captureOrder
] = createIndexes({
  hash: {targetProperties: ['status']}, 
});

const exampleOrder = captureOrder({
  orderId: '123abc',
  status: 'PLACED',
});

const placedOrders = orderStatusIndex.get('PLACED');
console.log(exampleOrder === placedOrders.values().next().value); // true

exampleOrder.status = 'SHIPPED';

console.log(placedOrders.size); // 0

const shippedOrders = orderStatusIndex.get('SHIPPED');
console.log(exampleOrder === shippedOrders.values().next().value); // true
```

In the above example you will notice that the size of the `placedOrders` set reduced from 1 to 0 
as soon as we updated the target property (`status`) of our example order.

When you have thousands of objects and need to look them up by a particular property, this 
indexing method is more than 1000x times faster than the alternative -- iterating and filtering.

```ts
const [
  {
    hash: { statusIndex: orderStatusIndex }
  },
  captureOrder
] = createIndexes({
  hash: {targetProperties: ['status']},
});

const statusMap = { 0: 'PLACED', 1: 'SHIPPED', 2: 'DELIVERED', 3: 'CANCELLED'};
const allObjects = Array.from(
  { length: 125000 }, 
  (_, i) => captureOrder({id: i, status: statusMap[i % 4] })
);

// Let's find all shipped orders the old fashioned way
const shippedOld = Object.values(allObjects).filter(({status}) => status === 'SHIPPED');
// ~4ms

// And the new way
const shipped = orderStatusIndex.get('SHIPPED');
// ~0.002ms

```

Not only is the new way much faster, but `shipped` will always be up-to-date, while `shippedOld` 
will contain incorrect records once a shipped order is updated to `'DELIVERED'` -- the filtered 
view has to be recalculated each time it is used.

The following test run was performed on a Macbook Air with an M2 CPU and 16GB RAM:

```
  README.md examples
    ✔ returns indexed objects
    ✔ updates indexes when values change
    Performance tests
Vanilla lookup: 4.186499834060669ms
Indexed lookup: 0.0023751258850097656ms
Index lookups are 1763 times faster
      ✔ looks up objects more than 1000x faster
Vanilla update: 0.0009169578552246094ms
Indexed update: 0.001291036605834961ms
Updates are 1.41 times slower
      ✔ updates are not more than twice as slow


  4 passing (9ms)
```

## Basic usage

Using an index has two steps:

* Instantiating the index with a list of indexed properties
* Giving it control of an object you want to index via the `captureObject` command returned in 
  the tuple following instantiation

Let's examine the first step now:

```ts
import { createIndexes } from 'proxy-indexer';

type Customer = {
  name: string;
  country: 'US' | 'AU' | 'NZ' | 'UK' | 'FR';
  status: 'ACTIVE' | 'PENDING' | 'BANNED' | 'DEACTIVATED';
}

const [
  {
    hash: { statusIndex, countryIndex },
  }, 
  captureCustomer
] = createIndexes<Customer>({
  hash: { targetProperties: ['status', 'country'] },
}); 
```

In the above example we instantiate an index for our customer entity, with indexes on country 
and status. The `createIndexes` function returns a tuple containing:

* An object containing the indexes, each as a property keyed by `'${targetProperty}Index'`
* A capture function

Using the capture function correctly is critical to proxy-indexer usage. The capture function 
takes an object and returns a proxied version of the same object. This allows the index to trap or
"spy on" property setting operations. This means that for proxy-indexer to work, _all subsequent 
calls to the indexed object must be via the proxy, not the original object._

The best way to ensure there is no access to the original object is to capture it at instantiation:

```ts
const createCustomer = (name: string, country: 'US' | 'AU' | 'NZ' | 'UK' | 'FR'): Customer => {
  return captureCustomer({
    name,
    country,
    status: 'PENDING'
  });
}
```

### Unique indexes that enforce one object per property

What if we wanted to enforce that no two objects have the same property, and look them up by 
that property? We can do that with a unique index.

```ts
const [{ 
    hash: {statusIndex}, 
    unique: {orderIdIndex} 
  }, 
  captureOrder
] = createIndexes({
  hash: {targetProperties: ['status']},
  unique: {targetProperties: ['orderId']}
});

const exampleOrder = captureOrder({
  orderId: '123abc',
  status: 'PLACED',
  cost: 400
});

const order = orderIdUniqueIndex.get('123abc')

const duplicateOrder = captureOrder({
  orderId: '123abc',
  status: 'SHIPPED',
  cost: 200
}); // throws UniqueConstraintViolation!

const updatedDuplicate = captureOrder({
  orderId: '456zyx',
  status: 'SHIPPED',
  cost: 200
});

updatedDuplicate.orderId = '123abc'; // throws UniqueConstraintViolation!
```

This is useful when an object has more than one identifier, such as an object that has an ID 
from a third party system.

### Deleting objects

Before dereferencing an object in your application, you must call delete on the object. This deletes it from all indexes. Proxy indexer adds the delete method to every captured object:

```ts

const exampleOrder = captureOrder({
  orderId: '123abc',
  status: 'PLACED',
  cost: 400
});

exampleOrder.deleteFromIndexes()
```
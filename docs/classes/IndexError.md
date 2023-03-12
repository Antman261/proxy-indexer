[proxy-indexer](../README.md) / [Exports](../modules.md) / IndexError

# Class: IndexError

## Hierarchy

- `Error`

  ↳ **`IndexError`**

  ↳↳ [`MissingIndex`](MissingIndex.md)

  ↳↳ [`MissingIndexValue`](MissingIndexValue.md)

  ↳↳ [`ConfigurationError`](ConfigurationError.md)

  ↳↳ [`UniqueConstraintViolation`](UniqueConstraintViolation.md)

## Table of contents

### Constructors

- [constructor](IndexError.md#constructor)

### Properties

- [message](IndexError.md#message)
- [name](IndexError.md#name)
- [stack](IndexError.md#stack)
- [prepareStackTrace](IndexError.md#preparestacktrace)
- [stackTraceLimit](IndexError.md#stacktracelimit)

### Methods

- [captureStackTrace](IndexError.md#capturestacktrace)

## Constructors

### constructor

• **new IndexError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1046

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1040

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1042

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4

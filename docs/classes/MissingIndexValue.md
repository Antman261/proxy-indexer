[proxy-indexer](../README.md) / [Exports](../modules.md) / MissingIndexValue

# Class: MissingIndexValue

## Hierarchy

- [`IndexError`](IndexError.md)

  ↳ **`MissingIndexValue`**

## Table of contents

### Constructors

- [constructor](MissingIndexValue.md#constructor)

### Properties

- [message](MissingIndexValue.md#message)
- [name](MissingIndexValue.md#name)
- [stack](MissingIndexValue.md#stack)
- [prepareStackTrace](MissingIndexValue.md#preparestacktrace)
- [stackTraceLimit](MissingIndexValue.md#stacktracelimit)

### Methods

- [captureStackTrace](MissingIndexValue.md#capturestacktrace)

## Constructors

### constructor

• **new MissingIndexValue**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[IndexError](IndexError.md).[constructor](IndexError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1046

## Properties

### message

• **message**: `string`

#### Inherited from

[IndexError](IndexError.md).[message](IndexError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

[IndexError](IndexError.md).[name](IndexError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1040

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[IndexError](IndexError.md).[stack](IndexError.md#stack)

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

[IndexError](IndexError.md).[prepareStackTrace](IndexError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[IndexError](IndexError.md).[stackTraceLimit](IndexError.md#stacktracelimit)

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

[IndexError](IndexError.md).[captureStackTrace](IndexError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/ts4.8/globals.d.ts:4

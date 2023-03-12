# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.2.0](https://github.com/Antman261/proxy-indexer/compare/v0.1.1...v0.2.0) (2023-03-12)


### ⚠ BREAKING CHANGES

* **unique index:** The createHashIndex function is no longer available.
All indexes must be created
using createIndexes

### Features

* **unique index:** added the ability to index object properties as unique ([#1](https://github.com/Antman261/proxy-indexer/issues/1)) ([d5e87a6](https://github.com/Antman261/proxy-indexer/commit/d5e87a61cef647ed3ff656d9d5bb5ac48a84645d))

### 0.1.1 (2022-12-14)


### Bug Fixes

* **hash index:** returns undefined instead of throwing when no value is present for index ([26c161e](https://github.com/Antman261/proxy-indexer/commit/26c161e1fd3275f513ea92e1a3623fd49c8c1775))

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueConstraintViolation = exports.createUniqueHashIndex = void 0;
const common_1 = require("./common");
function createUniqueHashIndex({ targetProperties, }) {
    const indexes = initialiseIndex(targetProperties);
    const captureUpdate = (obj, propName, newValue) => {
        const oldValue = obj[propName]; // ts is drunk
        const isUpdating = targetProperties.includes(propName) && oldValue !== newValue;
        if (isUpdating) {
            const index = indexes.get(propName);
            if (!index) {
                throw new common_1.MissingIndex(`Index missing for property [${propName}]`);
            }
            const oldIndexValue = index.has(oldValue);
            if (!oldIndexValue) {
                throw new common_1.MissingIndexValue(`Object was not captured correctly, missing index value for ${propName}:${oldValue}`);
            }
            index.delete(oldValue);
            insertIntoIndex(newValue, obj, index, propName);
        }
    };
    const ingestObject = (obj) => {
        targetProperties.forEach((targetProperty) => {
            const specifier = obj[targetProperty];
            const index = indexes.get(targetProperty);
            if (!index) {
                throw new common_1.MissingIndex(`Index missing for property [${targetProperty}]`);
            }
            insertIntoIndex(specifier, obj, index, targetProperty);
        });
    };
    const deleteObject = (obj) => {
        targetProperties.forEach((targetProperty) => {
            const specifier = obj[targetProperty];
            const index = indexes.get(targetProperty);
            if (!index) {
                throw new common_1.MissingIndex(`Index missing for property [${targetProperty}]`);
            }
            deleteFromIndex(specifier, index);
        });
    };
    return [
        targetProperties.reduce((acc, targetProperty) => {
            acc[`${targetProperty}Index`] = {
                get: (val) => {
                    return indexes?.get(targetProperty)?.get(val);
                },
            };
            return acc;
        }, {}),
        captureUpdate,
        ingestObject,
        deleteObject,
    ];
}
exports.createUniqueHashIndex = createUniqueHashIndex;
function initialiseIndex(targetProperties) {
    const indexes = new Map();
    targetProperties.forEach((targetProperty) => {
        indexes.set(targetProperty, new Map());
    });
    return indexes;
}
const deleteFromIndex = (specifier, index) => {
    index.delete(specifier);
};
const insertIntoIndex = (specifier, target, index, targetProperty) => {
    const hasExistingIndex = index.has(specifier);
    if (hasExistingIndex) {
        if (target !== index.get(specifier)) {
            throw new UniqueConstraintViolation(`Duplicate key value [${specifier}] already exists for property [${targetProperty}]`);
        }
    }
    index.set(specifier, target);
};
class UniqueConstraintViolation extends common_1.IndexError {
}
exports.UniqueConstraintViolation = UniqueConstraintViolation;

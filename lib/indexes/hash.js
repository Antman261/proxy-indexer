"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHashIndex = void 0;
const common_1 = require("./common");
function createHashIndex({ targetProperties, }) {
    const indexes = initialiseIndex(targetProperties);
    const captureUpdate = (obj, propName, newValue) => {
        const oldValue = obj[propName]; // ts is drunk
        const isUpdating = targetProperties.includes(propName) && oldValue !== newValue;
        if (isUpdating) {
            const index = indexes.get(propName);
            if (!index) {
                throw new common_1.MissingIndex(`Index missing for property [${propName}]`);
            }
            const oldIndexValues = index.get(oldValue);
            if (!oldIndexValues) {
                throw new common_1.MissingIndexValue(`Object was not captured correctly, missing index value for ${propName}:${oldValue}`);
            }
            oldIndexValues.delete(obj);
            insertIntoIndex(newValue, obj, index);
        }
    };
    const ingestObject = (obj) => {
        targetProperties.forEach((targetProperty) => {
            const specifier = obj[targetProperty];
            const index = indexes.get(targetProperty);
            if (!index) {
                throw new common_1.MissingIndex(`Index missing for property [${targetProperty}]`);
            }
            insertIntoIndex(specifier, obj, index);
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
    ];
}
exports.createHashIndex = createHashIndex;
function initialiseIndex(targetProperties) {
    const indexes = new Map();
    targetProperties.forEach((targetProperty) => {
        indexes.set(targetProperty, new Map());
    });
    return indexes;
}
const insertIntoIndex = (specifier, target, index) => {
    const hasExistingIndex = index.has(specifier);
    if (!hasExistingIndex) {
        index.set(specifier, new Set());
    }
    const newIndexValues = index.get(specifier);
    newIndexValues?.add(target);
};

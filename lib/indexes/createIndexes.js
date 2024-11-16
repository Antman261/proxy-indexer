"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexes = void 0;
const hash_1 = require("./hash");
const common_1 = require("./common");
const uniqueHash_1 = require("./uniqueHash");
function createIndexes(opts) {
    validateOptions(opts);
    const { hash: hashOpts, unique: uniqueOpts } = opts;
    const [hashIdx, updateInHashIndex, ingestIntoHashIndex, deleteFromHashIndex] = hashOpts ? (0, hash_1.createHashIndex)(hashOpts) : [];
    const [uniqueIdx, updateInUniqueIndex, ingestIntoUniqueIndex, deleteFromUniqueIndex,] = uniqueOpts ? (0, uniqueHash_1.createUniqueHashIndex)(uniqueOpts) : [];
    const updaters = [updateInUniqueIndex, updateInHashIndex].filter(isNotUndefined);
    const ingestors = [ingestIntoUniqueIndex, ingestIntoHashIndex].filter(isNotUndefined);
    const deleters = [deleteFromHashIndex, deleteFromUniqueIndex].filter(isNotUndefined);
    const captureObject = (obj) => {
        const proxy = new Proxy(Object.assign(obj, {
            deleteFromIndex() {
                deleters.forEach((deleteFromIndexFunc) => deleteFromIndexFunc(proxy));
            },
        }), {
            set(target, propName, newValue) {
                updaters.forEach((updateIndexFunc) => updateIndexFunc(proxy, propName, newValue));
                // @ts-ignore
                target[propName] = newValue;
                return true;
            },
        });
        ingestors.forEach((ingestIntoIndex) => ingestIntoIndex(proxy));
        return proxy;
    };
    return [{ hash: hashIdx ?? {}, unique: uniqueIdx ?? {} }, captureObject];
}
exports.createIndexes = createIndexes;
function isNotUndefined(element) {
    return element !== undefined;
}
function validateOptions({ hash, unique }) {
    if (hash === undefined || unique === undefined) {
        return;
    }
    const combinedProps = [...hash.targetProperties, ...unique.targetProperties];
    const deDupedProps = new Set(combinedProps);
    if (deDupedProps.size !== combinedProps.length) {
        const sharedProps = combinedProps.filter((prop) => deDupedProps.has(prop));
        throw new common_1.ConfigurationError(`Properties [${sharedProps}] used for both hash and unique index. A property must only be used in one type of index.`);
    }
}

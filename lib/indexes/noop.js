"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNoopCaptor = void 0;
function createNoopCaptor() {
    return (obj) => {
        return Object.assign({}, obj, {
            deleteFromIndex() {
                // No-op
            },
            getTarget() {
                return obj;
            },
            isProxy: true,
        });
    };
}
exports.createNoopCaptor = createNoopCaptor;

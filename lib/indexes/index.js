"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueConstraintViolation = exports.ConfigurationError = exports.MissingIndexValue = exports.MissingIndex = exports.IndexError = void 0;
__exportStar(require("./createIndexes"), exports);
var common_1 = require("./common");
Object.defineProperty(exports, "IndexError", { enumerable: true, get: function () { return common_1.IndexError; } });
Object.defineProperty(exports, "MissingIndex", { enumerable: true, get: function () { return common_1.MissingIndex; } });
Object.defineProperty(exports, "MissingIndexValue", { enumerable: true, get: function () { return common_1.MissingIndexValue; } });
Object.defineProperty(exports, "ConfigurationError", { enumerable: true, get: function () { return common_1.ConfigurationError; } });
var uniqueHash_1 = require("./uniqueHash");
Object.defineProperty(exports, "UniqueConstraintViolation", { enumerable: true, get: function () { return uniqueHash_1.UniqueConstraintViolation; } });

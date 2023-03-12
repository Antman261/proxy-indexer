"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationError = exports.MissingIndexValue = exports.MissingIndex = exports.IndexError = void 0;
class IndexError extends Error {
}
exports.IndexError = IndexError;
class MissingIndex extends IndexError {
}
exports.MissingIndex = MissingIndex;
class MissingIndexValue extends IndexError {
}
exports.MissingIndexValue = MissingIndexValue;
class ConfigurationError extends IndexError {
}
exports.ConfigurationError = ConfigurationError;

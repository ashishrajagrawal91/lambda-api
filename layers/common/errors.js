"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.NoContentError = exports.InvalidRequestError = exports.InternalServerError = exports.BaseError = void 0;
const badRequestCode = 400;
const notFoundCode = 404;
const noContentCode = 204;
const internalErrorCode = 500;
class BaseError extends Error {
    statusCode;
    errorName;
    errorMessage;
    constructor(message) {
        super(message);
        this.errorMessage = message || `Oops, something went wrong.`;
    }
}
exports.BaseError = BaseError;
class InvalidRequestError extends BaseError {
    constructor(message) {
        super(message);
        this.errorMessage = message;
        this.errorName = `InvalidRequestError`;
        this.statusCode = badRequestCode;
    }
}
exports.InvalidRequestError = InvalidRequestError;
class NoContentError extends BaseError {
    constructor(message) {
        super(message);
        this.errorMessage = message;
        this.errorName = `NoContentError`;
        this.statusCode = noContentCode;
    }
}
exports.NoContentError = NoContentError;
class NotFoundError extends BaseError {
    constructor(message) {
        super(message);
        this.errorMessage = message;
        this.errorName = `NotFoundError`;
        this.statusCode = notFoundCode;
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends BaseError {
    constructor(message) {
        super(message);
        this.errorName = `InternalServerError`;
        this.errorMessage = message;
        this.statusCode = internalErrorCode;
    }
}
exports.InternalServerError = InternalServerError;

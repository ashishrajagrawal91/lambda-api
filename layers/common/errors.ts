
const badRequestCode = 400;
const notFoundCode = 404;
const noContentCode = 204;
const internalErrorCode = 500;

class BaseError extends Error {
	statusCode: number;

	errorName: string;

	errorMessage: string;

	constructor(message: string) {
		super(message);
		this.errorMessage = message || `Oops, something went wrong.`;
	}
}

class InvalidRequestError extends BaseError {
	constructor(message: string) {
		super(message);
		this.errorMessage = message;
		this.errorName = `InvalidRequestError`;
		this.statusCode = badRequestCode;
	}
}

class NoContentError extends BaseError {
	constructor(message: string) {
		super(message);
		this.errorMessage = message;
		this.errorName = `NoContentError`;
		this.statusCode = noContentCode;
	}
}

class NotFoundError extends BaseError {
	constructor(message: string) {
		super(message);
		this.errorMessage = message;
		this.errorName = `NotFoundError`;
		this.statusCode = notFoundCode;
	}
}

class InternalServerError extends BaseError {
	constructor(message: string) {
		super(message);
		this.errorName = `InternalServerError`;
		this.errorMessage = message;
		this.statusCode = internalErrorCode;
	}
}

export {
	BaseError,
	InternalServerError,
	InvalidRequestError,
	NoContentError,
	NotFoundError,
};

// A custom error class that carries an HTTP status code alongside the message.
// This lets us throw errors from anywhere (services, controllers) and have
// the centralized handler know exactly what status code to respond with.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // marks this as a "known/expected" error, not a bug
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
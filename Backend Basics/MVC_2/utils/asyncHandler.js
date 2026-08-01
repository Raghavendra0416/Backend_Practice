// Wraps an async controller function.
// If the wrapped function throws or its promise rejects, the error
// is passed to Express's next() — which will route it to a centralized error handler.
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
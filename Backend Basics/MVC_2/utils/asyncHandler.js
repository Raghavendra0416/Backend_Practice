// Wraps an async controller function.
// If the wrapped function throws or its promise rejects, the error
// is passed to Express's next() — which will route it to a centralized error handler.
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;

// Express has internal error handling.
// So when Error is sent, the Express's default error handler took over, if you
// have no custom error-handling middleware yet.
//  The error response we got will be:
// - Raw HTML instead of clean JSON
// - The entire stack trace exposed in the response body — including your project's full file paths (D:\Study\Personal Project\Backend Practice\...)
// - A generic 500 status, even though this is really a 400 - level problem(bad / duplicate input, not a server crash)

// This is a real security concern, not just an ugly response.
// Leaking full file system paths and internal stack traces to any client hitting your API is
// exactly the kind of thing attackers use to fingerprint your server setup. This is precisely why
// centralized error handling exists
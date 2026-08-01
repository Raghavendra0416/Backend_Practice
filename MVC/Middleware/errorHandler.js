function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose: invalid ObjectId reaching the DB layer directly
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for field: ${err.path}`;
    }

    // MongoDB: duplicate key violation (unique: true fields)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0]; //finding the key
        message = `Duplicate value for field: ${field}`;
    }
    //When MongoDB rejects a duplicate, it returns an error object with err.code === 11000,
    // and — importantly — a keyValue property showing exactly which field/value collided
    // err.keyValue = { email: "priya.nair@example.com" }


    // Mongoose: schema validation failed at the DB layer
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(", ");
    }

    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your session has expired. Please log in again.";
    }

    // Log the full error server-side ONLY — never send this to the client
    console.error(err);

    res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = errorHandler;


// Express identifies error-handling middleware purely by it having 4 parameters: (err, req, res, next)
// Even though next is unused here, it must stay in the signature — Express checks the function's parameter count to decide whether it's a normal middleware or an error handler.
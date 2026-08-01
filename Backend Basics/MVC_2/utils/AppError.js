// A custom error class that carries an HTTP status code alongside the message.
// This lets us throw errors from anywhere (services, controllers) and have
// the centralized handler know exactly what status code to respond with.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);  // pass the message up to the built-in Error class
        this.statusCode = statusCode;  // // add our OWN custom property
        // the below marks this as a "known/expected" error, not a bug
        this.isOperational = true; //  // add another custom flag 
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;


// Right now, your errorHandler only knows how to translate specific Mongoose/MongoDB error types (CastError, code 11000, ValidationError) into clean responses.
// But what about errors you want` to throw yourself, from inside a controller or service, for business logic that has nothing to do with Mongoose?
// Example: in getUserById, you currently do:
// if (!user) {
//     return res.status(404).json({ error: "User not found" });
// }
//If we use If Statement then we will be repetating the code.

// Why extend Error at all?
// JavaScript's built-in Error class already does a lot of useful work for you.
// and you're saying "AppError is a Error, plus some extra features I'm adding."
// This is inheritance — AppError gets everything Error already does, for free, and then extends it.

// Why the constructor?
// The constructor runs whenever you write new AppError(...). It defines what information you must supply when creating one.

// Breaking down each line:
// super(message) — calls the parent class's (Error's) constructor, which sets up this.message and the stack trace machinery.
// You must call super() before using this in a subclass constructor — this is a JavaScript rule, not just a convention.

// this.statusCode = statusCode — a plain Error has no concept of HTTP status codes.
// This is your addition, specifically so errorHandler can read err.statusCode later.

// this.isOperational = true — marks this as a "known, expected" error (like "user not found" or "invalid input") as
// opposed to a genuine bug/crash (like a typo causing undefined.someProperty). This distinction becomes useful later
// if you want to, say, alert yourself on unexpected crashes but not on routine "404 not found" responses.

// Error.captureStackTrace(this, this.constructor) — a V8 (Node's JS engine) method that
// cleans up the stack trace, excluding the AppError constructor call itself from it, so the trace points to where you actually
// called throw new AppError(...), not into this file.
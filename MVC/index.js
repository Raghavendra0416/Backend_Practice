require("dotenv").config(); // must be the very first line, before anything reads process.env

const express = require("express");
const Mongoose = require("mongoose");

const UserActivityRouter = require("./Router/UserActivityRouter");
const BlogActivityRouter = require("./Router/BlogActivityRouter");
const AuthRouter = require("./Router/AuthRouter");

const errorHandler = require("./Middleware/errorHandler");


const PORT = 8089;
const server = express();
const DB_URL = "mongodb://localhost:27017/";
const DB_NAME = "Practice";
const DB_Connection = DB_URL + DB_NAME;


// Parses incoming JSON bodies into req.body
server.use(express.json());

//Routers to handle different api calls in MongoDB
// Auth Router -> handles the tokens
server.use('/api/v1/auth', AuthRouter);

//Users router -> handling data in MongoDB
server.use('/api/v1/users', UserActivityRouter);

//Blog Router -> handling data in MongoDB
server.use('/api/v1/blogs', BlogActivityRouter);

// Centralized error handler — MUST be registered after all routes
server.use(errorHandler);

// Connect to mongoose Database 
Mongoose.connect(DB_Connection).then(() => {
    console.log("Connected to MongoDB");
    console.log("Connected to database:", Mongoose.connection.name); //To check connected database
}).catch((err) => {
    console.log("Error COnnecting to MongoDB", err);
})

// Specifying which port it should be connected.
server.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})


//To connect to MongoDB to Backend, install Mongoose.

// Express checks routes top to bottom and matches the first one that fits.
// By putting your specific, no-middleware routes first,
// requests to /api/v1/users and /api/v1/blogs get handled immediately — they never
// reach the '/' catch-all with the middleware.

//Layers:
// Request → Router → Middleware → Controller → Service → Model/DB

// Error Files:
// AppError = a labeled envelope you can throw from anywhere in your code, with a status code and message already attached
// asyncHandler = the mail carrier that catches any thrown envelope(or rejected promise) and forwards it onward
// errorHandler = the sorting office at the very end that opens every envelope, reads the label, and sends back the appropriate response


// If there is a dupicate input passed by user.
// Then here's the actual sequence of events that will happen:
// 1. Request comes in → hits your route
// 2. validateId / validateBody middleware run(if any)
// 3. Controller function runs
// 4. Inside the controller, UserService.createUser() is called
// 5. Mongoose tries to insert into MongoDB → MongoDB rejects(duplicate key)
// 6. This rejection becomes a * rejected Promise * inside your async function
// 7. asyncHandler's .catch(next) catches it and calls next(err)
// 8. Express now looks for the NEXT matching middleware in its chain — specifically, the next one with 4 parameters(an error handler)
// 9. It skips over any remaining NORMAL routes / middleware entirely, and jumps straight to your errorHandler
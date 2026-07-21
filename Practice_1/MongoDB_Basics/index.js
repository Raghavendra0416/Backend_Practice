const express = require("express");
const Mongoose = require("mongoose");

// const UserActivityRouter = require('./Router/UserActivityRouter');
const HomeActivityRouter = require('./Router/HomeRouter');
const passwordAuthMiddleware = require('./Middleware/PasswordAuthMiddleware');
const UserActivityRouter = require("./Router/MongoDB_Routers/UserActivityRouter");
const BlogActivityRouter = require("./Router/MongoDB_Routers/BlogActivityRouter");


const PORT = 8089;
const server = express();
const DB_URL = "mongodb://localhost:27017/";
const DB_NAME = "Practice";
const DB_Connection = DB_URL + DB_NAME;

//Router handles Different api calls for pages
//Not needed for now, read the information at the end.
// server.use('/', passwordAuthMiddleware, HomeActivityRouter);

//Router handles Different api calls for users
// Disabling the below as we will be using MongoDB for users
// server.use('/api/v1/users', passwordAuthMiddleware, UserActivityRouter); 


// Parses incoming JSON bodies into req.body
server.use(express.json());

//Routers to handle different api calls in MongoDB
//Users router -> handaling data in MongoDB
server.use('/api/v1/users', UserActivityRouter);

//Blog Router -> handaling data in MongoDB
server.use('/api/v1/blogs', BlogActivityRouter);


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


//To connect to MongoDB to Backend, we need install Mongoose.


// Express checks routes top to bottom and matches the first one that fits.
// By putting your specific, no-middleware routes first,
// requests to /api/v1/users and /api/v1/blogs get handled immediately — they never
// reach the '/' catch-all with the middleware.
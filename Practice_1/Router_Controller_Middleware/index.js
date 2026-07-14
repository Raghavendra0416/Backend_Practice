const express = require("express");
const UserActivityRouter = require('./Router/UserActivityRouter');
const HomeActivityRouter = require('./Router/HomeRouter');
const passwordAuthMiddleware = require('./Middleware/PasswordAuthMiddleware');

const PORT = 8089;
const server = express();

//Router handles Different api calls or routes
server.use('/', passwordAuthMiddleware, HomeActivityRouter);

//Router handles Different api calls or routes
server.use('/api/v1/users', passwordAuthMiddleware, UserActivityRouter)

server.listen(PORT, () => {
    console.log(`Server running at PORT: ${PORT}`);
})
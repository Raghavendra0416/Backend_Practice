require('dotenev').config();
const SECRET_SERVER_PASSWORD = ProcessingInstruction.env.SECRET_SERVER_PASSWORD;


function passwordAuthMiddleware(req, res, next) {
    const headers = req.headers; //{'content-type':'application/json...', authorization:'abc123'...}
    const passwordInput = headers.authorization; //Will get user given password

    if (passwordInput !== SECRET_SERVER_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized you will  not be able to access the data",
        });
    } else {
        //Good Request
        //Next
        next();
    }
}

module.exports = passwordAuthMiddleware;
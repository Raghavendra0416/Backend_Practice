const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../Models/Users.Model");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        throw new AppError("Not authorized, no token provided.", 401);
    }

    // jwt.verify throws if the token is invalid/expired —
    // asyncHandler catches it and forwards to errorHandler automatically
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError("User belonging to this token no longer exists.", 401);
    }

    req.user = user; // attach the authenticated user for later use in controllers
    next();
});

module.exports = protect;
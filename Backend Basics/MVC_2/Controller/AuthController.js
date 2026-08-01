const asyncHandler = require("../utils/asyncHandler");
const AuthService = require("../Services/AuthService");

// REGISTER
const register = asyncHandler(async (req, res) => {
    const { user, token } = await AuthService.registerUser(req.validatedBody);

    // Strip password before sending back, even though `select: false`
    // already excludes it from queries — this document came from
    // .create(), which DOES include it in memory, so we remove it explicitly.
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({ success: true, user: userObj, token });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.validatedBody;
    const { user, token } = await AuthService.loginUser(email, password);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ success: true, user: userObj, token });
});

module.exports = { register, login };
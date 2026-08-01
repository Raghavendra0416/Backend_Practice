// the service layer only knows about business logic and data. 
// It throws AppError when something's wrong and returns plain data when something succeeds.

const User = require("../Models/Users.Model");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/AppError");

// REGISTER
const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError("Email already registered.", 400);
    }

    const user = await User.create(userData); // password gets hashed via pre-save hook
    const token = generateToken(user._id);

    return { user, token };
};

// LOGIN
const loginUser = async (email, password) => {
    // password has `select: false` in the schema, so we must explicitly ask for it here
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new AppError("Invalid email or password.", 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new AppError("Invalid email or password.", 401);
    }

    const token = generateToken(user._id);

    return { user, token };
};

module.exports = { registerUser, loginUser };
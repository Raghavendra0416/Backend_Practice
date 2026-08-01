// In Controller we are performing 2 operations:
// Validating input before performing DB operations.
// CRUD operations in Db using services.

const UserService = require("../Services/UserService");
//To control the errors(instead of repeating same logic)
const asyncHandler = require("../utils/asyncHandler");

// CREATE
const createUser = asyncHandler(async (req, res) => {
    const user = await UserService.createUser(req.validatedBody);
    res.status(201).json(user);
});

// READ all
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
});

// READ one
const getUserById = asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
});

// UPDATE
const updateUser = asyncHandler(async (req, res) => {
    const user = await UserService.updateUser(req.params.id, req.validatedBody);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
});

// DELETE
const deleteUser = asyncHandler(async (req, res) => {
    const user = await UserService.deleteUser(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};

//Why req.validatedBody instead of just using req.body?
// This is a small but deliberate convention: keep the raw,
// unvalidated req.body separate from the validated, trusted req.validatedBody.
// It makes it obvious, just by reading the controller, that this data has already passed
// validation — you're not left wondering "wait, was this checked already?" three files away.

//these controllers no longer have a catch block that sends a 400/500 JSON error response.
// If something throws right now (e.g. a duplicate email violating unique: true), asyncHandler
// will catch it and call next(err)
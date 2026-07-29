// In Controller we are performing 2 operations:
// Validating input before performing DB operations.
// CRUD operations in Db using services.

const UserService = require("../../Services/UserService");
const { validateUserInput, validateUserUpdate } = require("../../Validator/UserInputValidation");
const isValidObjectId = require("../../utils/validateObjectId");

// CREATE
const createUser = async (req, res) => {
    // Validating User sent data
    const result = validateUserInput(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues.map(issue => issue.message)
        });
    }

    // If Input good then create user in DB
    try {
        const user = await UserService.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ all
const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ one
const getUserById = async (req, res) => {
    // validating the data before returning response
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user ID format." });
    }

    // If Input good then read user from DB
    try {
        const user = await UserService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateUser = async (req, res) => {
    // Validating ID provided by user
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user ID format." });
    }

    // Validating the data, if Update required
    const result = validateUserUpdate(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.issues.map(issue => issue.message)
        });
    }

    if (Object.keys(result.data).length === 0) {
        return res.status(400).json({ error: "At least one field must be provided to update." });
    }

    // If input is good then update the user
    try {
        const user = await UserService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
const deleteUser = async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid user ID format." });
    }

    // If Input is good then connect to DB to delete the user
    try {
        const user = await UserService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
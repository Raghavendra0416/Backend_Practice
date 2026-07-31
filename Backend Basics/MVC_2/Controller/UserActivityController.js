// In Controller we are performing 2 operations:
// Validating input before performing DB operations.
// CRUD operations in Db using services.

const UserService = require("../Services/UserService");

// CREATE
const createUser = async (req, res) => {
    try {
        const user = await UserService.createUser(req.validatedBody);
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
    try {
        // const user = await UserService.updateUser(req.params.id, req.body);
        const user = await UserService.updateUser(req.params.id, req.validatedBody);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
const deleteUser = async (req, res) => {
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

//Why req.validatedBody instead of just using req.body?
// This is a small but deliberate convention: keep the raw,
// unvalidated req.body separate from the validated, trusted req.validatedBody.
// It makes it obvious, just by reading the controller, that this data has already passed
// validation — you're not left wondering "wait, was this checked already?" three files away.
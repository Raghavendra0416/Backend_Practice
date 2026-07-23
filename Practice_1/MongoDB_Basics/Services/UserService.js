const User = require("../../Models/Users.Model");

// CREATE
const createUser = async (userData) => {
    return await User.create(userData);
};

// READ all
const getAllUsers = async () => {
    return await User.find();
};

// READ one
const getUserById = async (id) => {
    return await User.findById(id);
};

// UPDATE
const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

// DELETE
const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
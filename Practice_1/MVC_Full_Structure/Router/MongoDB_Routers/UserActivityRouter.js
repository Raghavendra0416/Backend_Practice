const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../../Controller/MongoDB_Controller/UserActivityController");

//validators 
const validateBody = require("../../Middleware/validateBody");
const validateId = require("../../Middleware/validateId");
const { validateUserInput, validateUserUpdate } = require("../../Validator/UserInputValidation");

// Create new User or Post User 
router.post("/", validateBody(validateUserInput), createUser);
//Get All Users
router.get("/", getAllUsers);
//Get User By iD
router.get("/:id", validateId, getUserById);

// Update the existing User details
router.put("/:id", validateId, validateBody(validateUserUpdate), updateUser);

//Delete the existing User
router.delete("/:id", validateId, deleteUser);

module.exports = router;
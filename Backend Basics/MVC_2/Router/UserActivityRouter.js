const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../Controller/UserActivityController");

//validators 
const validateBody = require("../Middleware/validateBody");
const validateId = require("../Middleware/validateId");
const { validateUserInput, validateUserUpdate } = require("../Validator/UserInputValidation");
const protect = require("../Middleware/authMiddleware");

// Create new User or Post User 
router.post("/", validateBody(validateUserInput), createUser);
//Get All Users
router.get("/", getAllUsers);
//Get User By iD
router.get("/:id", validateId, getUserById);

// protect - now make sures that require a valid token before these two run 
// Update the existing User details
router.put("/:id", protect, validateId, validateBody(validateUserUpdate), updateUser);

//Delete the existing User
router.delete("/:id", protect, validateId, deleteUser);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../../Controller/MongoDB_Controller/UserActivityController");

//Get All Users
router.get("/", getAllUsers);
//Get User By iD
router.get("/:id", getUserById);

// Create new User or Post User
router.post("/", createUser);

// Update the existing User details
router.put("/:id", updateUser);

//Delete the existing User
router.delete("/:id", deleteUser);

module.exports = router;
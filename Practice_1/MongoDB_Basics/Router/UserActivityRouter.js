const express = require("express");
const { getAllUsersByRole, getUserByName, getAllUsers } = require("../Controller/UserActivityController");
const router = express.Router();


//get all Users
router.get('/getAllUsers', getAllUsers);
//Query Params
router.get('/allUsersByRole', getAllUsersByRole);
//URL Params
router.get('/getUserByName/:name', getUserByName);

module.exports = router;
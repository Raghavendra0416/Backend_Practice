const express = require("express");
const router = express.Router();

const { register, login } = require("../Controller/AuthController");
const validateBody = require("../Middleware/validateBody");
const { validateUserInput } = require("../Validator/UserInputValidation");
const { validateLoginInput } = require("../Validator/AuthValidation");

router.post("/register", validateBody(validateUserInput), register);
router.post("/login", validateBody(validateLoginInput), login);

module.exports = router;
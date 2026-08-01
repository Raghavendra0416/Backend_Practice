require("dotenv").config();
const generateToken = require("./utils/generateToken");

const token = generateToken("64f1a2b3c4d5e6f7a8b9c0d1");
console.log("Generated token:", token);
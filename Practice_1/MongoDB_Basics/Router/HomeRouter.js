const express = require("express");
const { homeResponse, aboutResponse, contactResponse } = require("../Controller/HomeController");
const router = express.Router();


router.get('/', homeResponse);
router.get('/home', homeResponse);
router.get('/about', aboutResponse);
router.get('/contacts', contactResponse);

module.exports = router;
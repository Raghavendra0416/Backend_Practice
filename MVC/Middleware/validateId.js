const isValidObjectId = require("../utils/validateObjectId");

function validateId(req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: "Invalid ID format." });
    }
    next();
}

module.exports = validateId;
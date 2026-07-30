const mongoose = require("mongoose");

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = isValidObjectId;

// If `mongoose.Types.ObjectId.isValid(id);` not used:
// Without it, here's what happens if someone hits: `GET /api/v1/users/hello123`
// Your controller calls: `const user = await User.findById(req.params.id);`
//Mongoose tries to cast "hello123" into an ObjectId to build the MongoDB query — and
// since it's not a valid 24-character hex string, this cast fails internally,
// throwing a raw CastError before it even reaches MongoDB. If you don't catch this specifically,
// the user gets an ugly, unhelpful error like:
// CastError: Cast to ObjectId failed for value "hello123" at path "_id"


// Think of ObjectId.isValid() like a bouncer checking ID at a club entrance —
// it's not checking whether the person (the actual document) exists inside,
// it's only checking whether the ID card itself is even a real, well-formatted ID before
// letting the request proceed further. Whether a document with that ID actually exists in the
// database is a separate check — that's what the if (!user) return res.status(404)... line handles afterward.


//isValidObjectId(id) → "Is this even a properly shaped ID?" (fails fast, no DB call needed)
//if (!user) after the DB call → "Does a document with this ID actually exist?" (requires querying the DB)
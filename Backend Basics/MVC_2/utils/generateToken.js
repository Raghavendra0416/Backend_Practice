const jwt = require("jsonwebtoken");

function generateToken(userId) {
    return jwt.sign(
        { id: userId },              // payload — data embedded in the token
        process.env.JWT_SECRET,      // secret key used to sign it
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } // token expiry
    );
}

module.exports = generateToken;

// For JWT_SECRET, use a long, random string — not something guessable.
// You can generate one quickly by running this in your terminal:
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Breaking the Code down
// jwt.sign(payload, secret, options) — creates and signs a new token in one call.

// { id: userId } — we're deliberately keeping the payload minimal, just the user's MongoDB _id.
// Avoid putting sensitive data (like email or password) in a JWT payload — it's not encrypted,
// only signed. Anyone can decode and read the payload (try pasting a JWT into jwt.io) — they just can't
// modify it without invalidating the signature.

// process.env.JWT_SECRET — this must be a long, random, secret string, kept in your .env file,
// never committed to version control. If someone learns this secret, they can forge valid tokens for any user.

// expiresIn: "1d" — after 1 day, the token stops being valid, even if the signature is technically
//  correct. This limits the damage if a token is ever stolen.
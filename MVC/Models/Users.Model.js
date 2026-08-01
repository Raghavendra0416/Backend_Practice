const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },
        age: { type: Number, required: true, min: 0, max: 120 },
        gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
        contact: { type: String, required: true, unique: true, trim: true },
        nationality: { type: String, required: true, trim: true },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false // excludes password from query results by default
        }
    },
    { timestamps: true }
);

// Runs automatically before every .save() (which .create() also triggers)
userSchema.pre("save", async function () {
    // Only re-hash if the password field was actually changed
    // (prevents re-hashing an already-hashed password on unrelated updates)
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

// Instance method — available on any fetched user document, e.g. user.comparePassword(...)
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 3rd arg pins the collection name to lowercase "users" to match what you renamed it to
const UserModel = mongoose.model("User", userSchema, "users");
module.exports = UserModel;
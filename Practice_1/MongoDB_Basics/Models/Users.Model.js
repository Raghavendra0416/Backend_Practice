const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
        },
        age: {
            type: Number,
            required: true,
            min: 0,
            max: 120
        },
        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },
        contact: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        nationality: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

// 3rd arg pins the collection name to lowercase "blogs" to match what you renamed it to
const UserModel = mongoose.model("User", userSchema, "Users");

module.exports = UserModel;
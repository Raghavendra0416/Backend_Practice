const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true,
            trim: true
            // Alternative: reference the User model instead of a plain string
            // author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        tags: {
            type: [String],
            default: []
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
        views: {
            type: Number,
            default: 0,
            min: 0
        },
        published: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true } // adds createdAt and updatedAt automatically
);

// 3rd arg pins the collection name to lowercase "blogs" to match what you renamed it to
const BlogModel = mongoose.model("Blog", blogSchema, "blogs");

module.exports = BlogModel;
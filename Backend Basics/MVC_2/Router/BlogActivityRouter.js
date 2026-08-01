const express = require("express");
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../Controller/BlogActivityController");

const validateBody = require("../Middleware/validateBody");
const validateId = require("../Middleware/validateId");
const { validateBlogInput, validateBlogUpdate } = require("../Validator/BlogInputValidation");
const protect = require("../Middleware/authMiddleware");

// Create a new blog
router.post("/", validateBody(validateBlogInput), createBlog);
// Get All Blogs
router.get("/", getAllBlogs);
// Get Blogs By ID
router.get("/:id", validateId, getBlogById);

// Update Blog
router.put("/:id", protect, validateId, validateBody(validateBlogUpdate), updateBlog);

// Delete Blog
router.delete("/:id", protect, validateId, deleteBlog);

module.exports = router;
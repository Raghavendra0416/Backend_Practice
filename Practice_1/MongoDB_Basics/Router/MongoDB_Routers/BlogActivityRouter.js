const express = require("express");
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../../Controller/MongoDB_Controller/BlogActivityController");

// Get All Blogs
router.get("/", getAllBlogs);
// Get Blogs By ID
router.get("/:id", getBlogById);

// Create a new blog
router.post("/", createBlog);

// Update Blog
router.put("/:id", updateBlog);

// Delete Blog
router.delete("/:id", deleteBlog);

module.exports = router;
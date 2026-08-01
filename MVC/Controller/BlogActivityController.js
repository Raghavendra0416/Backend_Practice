const BlogService = require("../Services/BlogService");
//For handling errors(removes repetating code)
const asyncHandler = require("../utils/asyncHandler");

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    const blog = await BlogService.createBlog(req.validatedBody);
    res.status(201).json(blog);
});

// Get all blogs 
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json(blogs);
});

// Get Blog By ID
const getBlogById = asyncHandler(async (req, res) => {
    const blog = await BlogService.getBlogById(req.params.id);
    if (!blog) {
        throw new AppError("Blog not found", 404);
    }
    res.status(200).json(blog);
});

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const blog = await BlogService.updateBlog(req.params.id, req.validatedBody);
    if (!blog) {
        throw new AppError("Blog not found", 404);
    }
    res.status(200).json(blog);
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await BlogService.deleteBlog(req.params.id);
    // Not using app error and leaving like this just for example. 
    if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
});

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };

//these controllers no longer have a catch block that sends a 400/500 JSON error response.
// If something throws right now (e.g. a duplicate email violating unique: true), asyncHandler
// will catch it and call next(err)
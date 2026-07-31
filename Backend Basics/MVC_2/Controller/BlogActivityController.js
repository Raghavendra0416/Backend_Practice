const BlogService = require("../Services/BlogService");

const createBlog = async (req, res) => {
    try {
        const blog = await BlogService.createBlog(req.validatedBody);
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogService.getAllBlogs();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await BlogService.getBlogById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const blog = await BlogService.updateBlog(req.params.id, req.validatedBody);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await BlogService.deleteBlog(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
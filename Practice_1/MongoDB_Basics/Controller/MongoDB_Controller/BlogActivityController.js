const Blog = require("../../Models/Blogs.Model");

// CREATE
const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// READ all
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ one
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
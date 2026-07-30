// Not creating the Blog Service, It is same as User Service.

const Blog = require("../Models/Blogs.Model");

const createBlog = (data) => Blog.create(data);

const getAllBlogs = () => Blog.find();

const getBlogById = (id) => Blog.findById(id);

const updateBlog = (id, data) =>
    Blog.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteBlog = (id) => Blog.findByIdAndDelete(id);

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
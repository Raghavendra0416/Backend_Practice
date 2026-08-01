const z = require("zod");

const BlogInputValidationSchema = z.object({
    title: z.string({ error: "Title is required and must be a string." }).trim().min(3),
    content: z.string({ error: "Content is required and must be a string." }).trim().min(10),
    author: z.string({ error: "Author is required and must be a string." }).trim().min(1),
    category: z.string({ error: "Category is required and must be a string." }).trim().min(1),
    tags: z.array(z.string()).optional().default([]),
    likes: z.number().min(0).optional().default(0),
    views: z.number().min(0).optional().default(0),
    published: z.boolean().optional().default(true)
});

const BlogUpdateValidationSchema = BlogInputValidationSchema.partial();

function validateBlogInput(userBody) {
    return BlogInputValidationSchema.safeParse(userBody);
}

function validateBlogUpdate(userBody) {
    return BlogUpdateValidationSchema.safeParse(userBody);
}

module.exports = { validateBlogInput, validateBlogUpdate };
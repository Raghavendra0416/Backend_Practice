const z = require("zod");

const BlogInputValidationSchema = z.object({
    title: z.string({
        error: "Title is required and must be a string."
    }).trim().min(3, { error: "Title must be at least 3 characters long." }),

    content: z.string({
        error: "Content is required and must be a string."
    }).trim().min(10, { error: "Content must be at least 10 characters long." }),

    author: z.string({
        error: "Author is required and must be a string."
    }).trim().min(1, { error: "Author cannot be empty." }),

    category: z.string({
        error: "Category is required and must be a string."
    }).trim().min(1, { error: "Category cannot be empty." }),

    tags: z.array(z.string(), {
        error: "Tags must be an array of strings."
    }).optional().default([]),

    likes: z.number({
        error: "Likes must be a number."
    }).min(0).optional().default(0),

    views: z.number({
        error: "Views must be a number."
    }).min(0).optional().default(0),

    published: z.boolean({
        error: "Published must be true or false."
    }).optional().default(true)
});

function validateBlogInput(userBody) {
    return BlogInputValidationSchema.safeParse(userBody);
}

module.exports = validateBlogInput;
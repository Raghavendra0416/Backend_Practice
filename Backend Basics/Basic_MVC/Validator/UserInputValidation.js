const z = require("zod");

const UserInputValidationSchema = z.object({
    name: z.string({
        error: "Name is required and must be a string."
    }).trim().min(1, { error: "Name cannot be empty." }),

    email: z.email({
        error: "Please enter a valid email address."
    }),

    age: z.number({
        error: "Age is required and must be a number."
    }).min(0).max(120),

    gender: z.enum(["Male", "Female", "Other"], {
        error: "Gender must be Male, Female, or Other."
    }),

    contact: z.string({
        error: "Contact is required and must be a string."
    }).regex(/^\d{10}$/, { error: "Contact must be a 10-digit number." }),

    nationality: z.string({
        error: "Nationality is required and must be a string."
    }).trim().min(2, { error: "Please enter a valid nationality." }),

    password: z.string().refine((val) => {
        const hasMinLen = val.length >= 7;
        const hasNumber = /[0-9]/.test(val);
        const hasSpecial = /[^a-zA-Z0-9]/.test(val);
        return hasMinLen && hasNumber && hasSpecial;
    }, { error: "Password must be at least 7 characters and include a number and a special character." })
});

// For updates — every field becomes optional, but if present, same rules apply
const UserUpdateValidationSchema = UserInputValidationSchema.partial();

// for Create
function validateUserInput(userBody) {
    return UserInputValidationSchema.safeParse(userBody);
}

// For Update
function validateUserUpdate(userBody) {
    return UserUpdateValidationSchema.safeParse(userBody);
}

module.exports = { validateUserInput, validateUserUpdate };

//safeParse() - doesn't throw — it returns an object with either success: true, data or success: false, error
// .parse() — throws a ZodError if validation fails, and returns the parsed data directly if it succeeds.
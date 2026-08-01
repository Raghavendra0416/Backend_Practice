const z = require("zod");

const LoginValidationSchema = z.object({
    email: z.email({ error: "Please enter a valid email address." }),
    password: z.string({ error: "Password is required." }).min(1, { error: "Password is required." })
});

function validateLoginInput(body) {
    return LoginValidationSchema.safeParse(body);
}

module.exports = { validateLoginInput };
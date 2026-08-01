function validateBody(validatorFn) {
    return (req, res, next) => {
        const result = validatorFn(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.issues.map(issue => issue.message)
            });
        }

        req.validatedBody = result.data; // pass clean data forward
        next();
    };
}

module.exports = validateBody;
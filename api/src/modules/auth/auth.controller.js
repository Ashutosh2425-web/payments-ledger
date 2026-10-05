const { registerUser, loginUser } = require("./auth.service");
const { registerSchema } = require("./auth.validation");

async function register(req, res, next) {
    try {
        const data = registerSchema.parse(req.body);

        const result = await registerUser(
            data.email,
            data.password
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.user,
            account: result.account
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const data = registerSchema.parse(req.body);

        const result = await loginUser(
            data.email,
            data.password
        );

        res.status(200).json({
            message: "Login successful",
            user: result.user,
            token: result.token
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
};
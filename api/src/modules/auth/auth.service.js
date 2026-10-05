const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const withTransaction = require("../../db/transaction");

async function registerUser(email, password) {
    return withTransaction(async (client) => {
        const existingUser = await client.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            const error = new Error("Email already registered");
            error.statusCode = 409;
            throw error;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const userResult = await client.query(
            `INSERT INTO users (email, password_hash)
             VALUES ($1, $2)
             RETURNING id, email, role, created_at`,
            [email, passwordHash]
        );

        const user = userResult.rows[0];

        const accountResult = await client.query(
            `INSERT INTO accounts (user_id, account_type, normal_side)
             VALUES ($1, 'USER_WALLET', 'CREDIT')
             RETURNING id, account_type, normal_side`,
            [user.id]
        );

        const account = accountResult.rows[0];

        await client.query(
            `INSERT INTO account_balances (account_id, balance_minor)
             VALUES ($1, 0)`,
            [account.id]
        );

        return {
            user,
            account
        };
    });
}

async function loginUser(email, password) {
    const result = await withTransaction(async (client) => {
        const userResult = await client.query(
            `SELECT id, email, password_hash, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        const user = userResult.rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            throw error;
        }

        return user;
    });

    const token = jwt.sign(
        {
            userId: result.id,
            role: result.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    return {
        user: {
            id: result.id,
            email: result.email,
            role: result.role
        },
        token
    };
}

module.exports = {
    registerUser,
    loginUser
};
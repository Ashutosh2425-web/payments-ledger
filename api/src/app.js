const express = require("express");
const pool = require("./db/pool");

const authRoutes = require("./modules/auth/auth.routes");
const authMiddleware = require("./modules/auth/auth.middleware");
const requireRole = require("./modules/auth/role.middleware");
const accountsRoutes = require("./modules/accounts/accounts.routes");

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/accounts", accountsRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Payments Ledger API is running"
    });
});

app.get("/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error("Health check failed:", error.message);

        res.status(503).json({
            status: "error",
            database: "disconnected"
        });
    }
});

app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You accessed a protected route",
        user: req.user
    });
});

app.get(
    "/admin",
    authMiddleware,
    requireRole("ADMIN"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the admin area",
            user: req.user
        });
    }
);

module.exports = app;
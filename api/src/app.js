const express = require("express");
const pool = require("./db/pool");

const app = express();

app.use(express.json());

const authRoutes = require("./modules/auth/auth.routes");
app.use("/auth", authRoutes);

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

module.exports = app;
const express = require("express");
const pool = require("./db/pool");

const app = express();

const PORT = 5000;

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

app.listen(PORT, () => {
    console.log(`Payments Ledger API running on port ${PORT}`);
});
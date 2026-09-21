const express = require("express");
const pool = require("./db/pool");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Payments Ledger API is running"
    });
});

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("PostgreSQL connection successful");

        app.listen(PORT, () => {
            console.log(`Payments Ledger API running on port ${PORT}`);
        });
    } catch (error) {
        console.error("PostgreSQL connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
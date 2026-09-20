const express = require("express");

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Payments Ledger API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Payments Ledger API running on port ${PORT}`);
});
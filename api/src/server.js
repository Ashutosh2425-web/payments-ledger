require("dotenv").config();

const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Payments Ledger API running on port ${PORT}`);
});
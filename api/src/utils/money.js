function rupeesToPaise(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
        throw new Error("Amount must be a valid number");
    }

    if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
    }

    if (!Number.isInteger(amount * 100)) {
        throw new Error("Amount can have at most two decimal places");
    }

    return Math.round(amount * 100);
}

function paiseToRupees(amountMinor) {
    if (!Number.isInteger(amountMinor)) {
        throw new Error("Amount must be an integer number of paise");
    }

    return amountMinor / 100;
}

module.exports = {
    rupeesToPaise,
    paiseToRupees
};
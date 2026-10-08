const pool = require("../../db/pool");

async function getMyAccount(userId) {
    const result = await pool.query(
        `SELECT
            a.id,
            a.account_type,
            a.normal_side,
            ab.balance_minor,
            ab.updated_at
         FROM accounts a
         JOIN account_balances ab
            ON ab.account_id = a.id
         WHERE a.user_id = $1
           AND a.account_type = 'USER_WALLET'`,
        [userId]
    );

    if (result.rows.length === 0) {
        const error = new Error("Wallet account not found");
        error.statusCode = 404;
        throw error;
    }

    const account = result.rows[0];

    return {
        ...account,
        balance_minor: Number(account.balance_minor)
    };
}

module.exports = {
    getMyAccount
};
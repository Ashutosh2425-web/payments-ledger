const { getMyAccount } = require("./accounts.service");

async function getMe(req, res, next) {
    try {
        const account = await getMyAccount(req.user.userId);

        res.status(200).json({
            account
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getMe
};
const passport = require('passport');
const { sendResponse } = require('../services/responseHandler');
const logger = require('../utils/logger');

const passportAdminLoginMiddleware = (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) {
            console.log("passportAdminLoginMiddleware Error:", err);
            logger.error(`passportAdminLoginMiddleware : ${err.message}`);
            return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
        }

        if (!user) {
            return sendResponse(res, "UNAUTHORIZED", info.message);
        }

        req.logIn(user, (err) => {

            if (err) {
                console.log("passportAdminLoginMiddleware Error:", err);
                logger.error(`passportAdminLoginMiddleware : ${err.message}`);
                return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
            }
            return sendResponse(res, "OK", 'Login successful.', user);
        });
    })(req, res, next);
}

module.exports = { passportAdminLoginMiddleware };
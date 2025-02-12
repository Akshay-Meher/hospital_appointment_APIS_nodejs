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


        console.log("passportAdminLoginMiddleware");

    })(req, res, next);
}

const checkAdminLogin = (req, res, next) => {

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return sendResponse(res, "UNAUTHORIZED", "Unauthorized access. Please log in.");
    }

    console.log("checkAdminLogin", req.user);
    // Check if the user is an admin
    if (req.user.modelName && req.user.modelName !== 'Admin') {
        return sendResponse(res, "FORBIDDEN", 'Access forbidden: Admins only.');
    }

    next();
};

module.exports = { passportAdminLoginMiddleware, checkAdminLogin };
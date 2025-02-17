const passport = require('../config/passportConfig');
const { sendResponse } = require('../services/responseHandler');
const logger = require('../utils/logger');
const { loginSuccessful, invalidOTP } = require('../utils/responseMessages');

const otpLoginPassportMiddleware = (req, res, next) => {
    passport.authenticate('otp-login', (err, user, info) => {

        if (err) {
            console.log("otpLoginPassportMiddleware Error:", err);
            logger.error(`otpLoginPassportMiddleware : ${err.message}`);
            return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
        }


        console.log("otpLoginPassportMiddleware Error:", err);
        if (err) return res.status(500).json({ message: "Server error", error: err });
        if (!user) return res.status(info.code).json({ message: info.message });

        req.logIn(user, (err) => {
            if (err) return sendResponse(res, "BAD_REQUEST", invalidOTP("OTP"));
            // return res.json({ message: "Login successful", user });
            return sendResponse(res, "OK", loginSuccessful(), user);
        });
    })(req, res, next);
}

module.exports = otpLoginPassportMiddleware;
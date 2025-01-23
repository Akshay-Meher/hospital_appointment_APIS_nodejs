const passport = require('passport');
const { sendResponse } = require('../services/responseHandler');
const { executeModelMethod } = require('../services/executeModelMethod');
const { tooManyfailedAttempts } = require('../utils/responseMessages');


const passportLoginController = (req, res, next) => {
    passport.authenticate('local-login', async (err, user, info) => {
        if (err) {
            console.log("passportAdminLoginMiddleware Error:", err);
            logger.error(`passportAdminLoginMiddleware : ${err.message}`);
            return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
        }

        if (!user) {
            if (info.code === 404) {
                return sendResponse(res, "NOT_FOUND", info.message);
            } else if (info.code === 429) {
                return sendResponse(res, "TOO_MANY_REQUESTS", info.message);
            } else if (info.code === 401) {
                return sendResponse(res, "UNAUTHORIZED", info.message);
            }
            console.log("passportAdminLoginMiddleware Error: 1111", info);
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
};





// const passportLoginController = (req, res, next) => {
//     passport.authenticate('local-login', (err, user, info) => {
//         if (err) {
//             console.log("passportAdminLoginMiddleware Error:", err);
//             logger.error(`passportAdminLoginMiddleware : ${err.message}`);
//             return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
//         }

//         if (!user) {
//             return sendResponse(res, "UNAUTHORIZED", info.message);
//         }

//         req.logIn(user, (err) => {

//             if (err) {
//                 console.log("passportAdminLoginMiddleware Error:", err);
//                 logger.error(`passportAdminLoginMiddleware : ${err.message}`);
//                 return sendResponse(res, "INTERNAL_SERVER_ERROR", err);
//             }
//             return sendResponse(res, "OK", 'Login successful.', user);
//         });
//     })(req, res, next);
// };


module.exports = { passportLoginController };
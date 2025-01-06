const jwt = require('jsonwebtoken');
const { sendResponse } = require('../services/responseHandler');
const { UNAUTHORIZED } = require('../services/statusCodes');
const { tokenNotProvided, invalidToken } = require('../utils/responseMessages');

const isLoginMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, UNAUTHORIZED, tokenNotProvided());
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {

        return sendResponse(res, UNAUTHORIZED, invalidToken());
    }
};

module.exports = isLoginMiddleware;

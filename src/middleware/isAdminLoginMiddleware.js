const jwt = require('jsonwebtoken');
const { sendResponse } = require('../services/responseHandler');
const { UNAUTHORIZED } = require('../services/statusCodes');
const { tokenNotProvided, invalidToken, provideAdminToken } = require('../utils/responseMessages');

const isAdminLoginMiddleware = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendResponse(res, UNAUTHORIZED, tokenNotProvided());
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role != 'admin') {
            return sendResponse(res, UNAUTHORIZED, provideAdminToken());
        }

        req.user = decoded;
        next();
    } catch (error) {
        return sendResponse(res, UNAUTHORIZED, invalidToken());
    }
};

module.exports = isAdminLoginMiddleware;

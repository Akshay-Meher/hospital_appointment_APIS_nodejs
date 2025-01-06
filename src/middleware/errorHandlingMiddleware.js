const { sendResponse } = require('../services/responseHandler');
const logger = require('../utils/logger');

const handleServerError = (err, req, res, next) => {
    logger.error(`${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // res.status(500).send('Internal Server Error');

    if (err) {
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', null, {
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
    }

}

module.exports = { handleServerError };
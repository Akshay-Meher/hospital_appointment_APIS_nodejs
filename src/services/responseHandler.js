const StatusCodes = require('./statusCodes');

/**
 * Sends a standardized API response with proper status suggestions.
 * @param {object} res - Express response object.
 * @param {'OK' | 'CREATED' | 'ACCEPTED' | 'NO_CONTENT' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'METHOD_NOT_ALLOWED' | 'CONFLICT' | 'UNPROCESSABLE_ENTITY' | 'TOO_MANY_REQUESTS' | 'INTERNAL_SERVER_ERROR' | 'NOT_IMPLEMENTED' | 'BAD_GATEWAY' | 'SERVICE_UNAVAILABLE' | 'GATEWAY_TIMEOUT'} statusKey - The status key.
 * @param {string|null} customMessage - Custom message to override the default (optional).
 * @param {object|null} data - Data to include in the response (optional).
 */

const sendResponse = (res, statusKey, customMessage = null, data = null) => {
    try {

        if (!res || typeof res.status !== 'function') {
            throw new Error('Invalid response object passed to sendResponse.');
        }

        const status = StatusCodes.getStatus(statusKey);
        if (!status) {
            throw new Error(`Invalid statusKey: "${statusKey}" passed to sendResponse.`);
        }


        res.status(status.code).json({
            success: status.code >= 200 && status.code < 300,
            message: customMessage || status.message,
            data: data || null,
        });
    } catch (error) {

        // console.error('Error in sendResponse:', error.message);

        res.status(500).json({
            success: false,
            message: 'An unexpected error occurred while processing the request.',
            error: error.message,
        });
    }
};

module.exports = { sendResponse };

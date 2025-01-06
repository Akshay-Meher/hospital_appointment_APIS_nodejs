const StatusCodes = {
    // Success
    OK: { code: 200, message: 'Request processed successfully.' },
    CREATED: { code: 201, message: 'Resource created successfully.' },
    ACCEPTED: { code: 202, message: 'Request accepted for processing.' },
    NO_CONTENT: { code: 204, message: 'Request processed successfully, no content returned.' },

    // Client Errors
    BAD_REQUEST: { code: 400, message: 'Invalid request data.' },
    UNAUTHORIZED: { code: 401, message: 'Unauthorized access. Please log in.' },
    FORBIDDEN: { code: 403, message: 'Access to this resource is forbidden.' },
    NOT_FOUND: { code: 404, message: 'Requested resource not found.' },
    METHOD_NOT_ALLOWED: { code: 405, message: 'HTTP method not allowed on this resource.' },
    CONFLICT: { code: 409, message: 'Request conflict with current state of the server.' },
    UNPROCESSABLE_ENTITY: { code: 422, message: 'Request contains unprocessable data.' },
    TOO_MANY_REQUESTS: { code: 429, message: 'Too many requests. Please try again later.' },

    // Server Errors
    INTERNAL_SERVER_ERROR: { code: 500, message: 'An unexpected error occurred on the server.' },
    NOT_IMPLEMENTED: { code: 501, message: 'The server does not support the requested functionality.' },
    BAD_GATEWAY: { code: 502, message: 'Invalid response from the upstream server.' },
    SERVICE_UNAVAILABLE: { code: 503, message: 'The server is temporarily unavailable. Please try again later.' },
    GATEWAY_TIMEOUT: { code: 504, message: 'The server did not receive a timely response from the upstream server.' },


    /**
     * Get the status object dynamically.
     * @param {string} statusKey - The key for the status (e.g., 'SUCCESS').
     * @returns {object} - Status code and message.
     */
    getStatus: function (statusKey) {
        if (this[statusKey]) {
            return this[statusKey];
        }
        return { code: 500, message: "Unknown status" };
    },
};

module.exports = StatusCodes;



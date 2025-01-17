const { validationResult } = require('express-validator');
const { sendResponse } = require('../services/responseHandler');

const checkValidationMidd = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // const formattedErrors = errors.array().reduce((acc, error) => {
        //     acc[error.param] = error.msg;
        //     return acc;
        // }, {});

        const formattedErrors = errors.array().reduce((acc, error) => {
            acc.push(error.msg);
            return acc;
        }, []);

        // console.log("formattedErrors", formattedErrors);

        console.log("formattedErrors", formattedErrors);
        // console.log("req.body", req.body);

        return sendResponse(res, "BAD_REQUEST", formattedErrors);
    }

    next();
};

module.exports = checkValidationMidd;
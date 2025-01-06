const { Hospital } = require('../../models');
const { validationResult } = require('express-validator');
const { sendResponse } = require('../../services/responseHandler');
const { CREATED, OK, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../../services/statusCodes');
const { executeModelMethod } = require('../../services/executeModelMethod');
const {
    registeredSuccessfullyMessage,
    notFound,
    updatedSuccessfully
} = require('../../utils/responseMessages');
const logger = require('../../utils/logger');

exports.createHospital = async (req, res) => {
    const { name, address, phone } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 'BAD_REQUEST', 'Validation Errors', errors.array());
    }

    try {
        const modelWithMethod = {
            modelName: "Hospital",
            methodName: "create",
            args: { name, address, phone }
        };

        const hospital = await executeModelMethod(modelWithMethod);
        return sendResponse(res, "CREATED", registeredSuccessfullyMessage('Hospital'), hospital);

    } catch (err) {
        logger.error(`createHospital : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};


exports.getAllHospitals = async (req, res) => {
    try {
        const modelWithMethod = {
            modelName: "Hospital",
            methodName: "findAll",
            args: { where: { is_deleted: false } }
        };

        const hospitals = await executeModelMethod(modelWithMethod);
        return sendResponse(res, "OK", null, hospitals);

    } catch (err) {
        logger.error(`getAllHospitals : ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", "INTERNAL SERVER ERROR");
    }
};


exports.getHospitalById = async (req, res) => {
    const { id } = req.params;

    try {
        const modelWithMethod = {
            modelName: "Hospital",
            methodName: "findOne",
            args: { where: { id, is_deleted: false } }
        };

        const hospital = await executeModelMethod(modelWithMethod);

        if (!hospital) {
            return sendResponse(res, "NOT_FOUND", notFound('Hospital'));
        }

        return sendResponse(res, "OK", null, hospital);

    } catch (err) {
        logger.error(`getHospitalById : ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", "INTERNAL SERVER ERROR");
    }
};


exports.updateHospital = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendResponse(res, 'BAD_REQUEST', 'Validation Errors', errors.array());
    }

    try {
        const hospital = await executeModelMethod({
            modelName: "Hospital",
            methodName: "findOne",
            args: { where: { id, is_deleted: false } }
        });

        if (!hospital) {
            return sendResponse(res, "NOT_FOUND", notFound("Hospital"));
        }

        await executeModelMethod({
            modelName: "Hospital",
            methodName: "update",
            args: [
                updateData,
                { where: { id, is_deleted: false } }
            ]
        });

        const updatedHospital = await executeModelMethod({
            modelName: "Hospital",
            methodName: "findOne",
            args: { where: { id, is_deleted: false } }
        });

        return sendResponse(res, "OK", updatedSuccessfully("Hospital"), updatedHospital);

    } catch (err) {
        logger.error(`updateHospital : ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", "INTERNAL SERVER ERROR");
    }
};


exports.deleteHospital = async (req, res) => {
    const { id } = req.params;

    try {
        const hospital = await executeModelMethod({
            modelName: "Hospital",
            methodName: "findOne",
            args: { where: { id, is_deleted: false } }
        });

        if (!hospital) {
            return sendResponse(res, "NOT_FOUND", notFound("Hospital"));
        }

        await executeModelMethod({
            modelName: "Hospital",
            methodName: "update",
            args: [
                { is_deleted: true },
                { where: { id } }
            ]
        });

        return sendResponse(res, "OK", "Hospital deleted successfully.");

    } catch (err) {
        logger.error(`deleteHospital : ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", "INTERNAL SERVER ERROR");
    }
};

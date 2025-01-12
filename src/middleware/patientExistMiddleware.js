const { executeModelMethod } = require("../services/executeModelMethod");
const { sendResponse } = require("../services/responseHandler");
const { emialExistsMessage, licenseDuplicate } = require("../utils/responseMessages");


const checkPatientExist = async (req, res, next) => {
    try {

        const { email } = req.body;

        const modelWithMethod = {
            modelName: "Patient",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };
        const patientExists = await executeModelMethod(modelWithMethod);

        if (patientExists) {
            return sendResponse(res, 'CONFLICT', emialExistsMessage('patient'));
        }

        next();

    } catch (error) {
        console.log("checkPatientExist err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", err.message);
    }
}

const checkAdminExist = async (req, res, next) => {
    try {

        const { email } = req.body;

        const modelWithMethod = {
            modelName: "Admin",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };
        const patientExists = await executeModelMethod(modelWithMethod);

        if (patientExists) {
            return sendResponse(res, 'CONFLICT', emialExistsMessage('Admin'));
        }

        next();

    } catch (error) {
        console.log("checkPatientExist err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", err.message);
    }
}

const checkDoctorExist = async (req, res, next) => {
    try {

        const { email, license_number } = req.body;
        // console.log("email", email);
        const modelWithMethod = {
            modelName: "Doctor",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };

        const modelWithMethodForLice = {
            modelName: "Doctor",
            methodName: "findOne",
            args: { where: { license_number, is_deleted: false } }
        }

        const doctorExists = await executeModelMethod(modelWithMethod);

        if (doctorExists) {
            return sendResponse(res, 'CONFLICT', emialExistsMessage('Doctor'));
        }

        const licenseExists = await executeModelMethod(modelWithMethodForLice);

        if (licenseExists) {
            return sendResponse(res, 'CONFLICT', licenseDuplicate());
        }

        next();

    } catch (error) {
        console.log("checkPatientExist err", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR", err.message);
    }
}

module.exports = { checkPatientExist, checkDoctorExist, checkAdminExist };

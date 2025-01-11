const { Doctor } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { sendResponse } = require('../../services/responseHandler');
const { FORBIDDEN, OK } = require('../../services/statusCodes');
const generateToken = require('../../services/generateToken');
const { comparePassword, hashPassword } = require('../../services/comparePassword');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { licenseDuplicate, emialExistsMessage, registeredSuccessfullyMessage, notFoundEmail, invalidCredential, loginSuccessful, tooManyfailedAttempts } = require('../../utils/responseMessages');
const logger = require('../../utils/logger');

dotenv.config();

exports.registerDoctor = async (req, res) => {
    let { name, last_name, email, password, phone, gender, specialization, license_number, years_of_experience } = req.body;

    try {

        password = await hashPassword(password);
        const modelWithMethod1 = {
            modelName: "Doctor",
            methodName: "create",
            args: { name, last_name, email, password, phone, gender, specialization, license_number, years_of_experience }
        };

        const doctor = await executeModelMethod(modelWithMethod1);

        return sendResponse(res, "CREATED", registeredSuccessfullyMessage("Doctor"), doctor);

    } catch (err) {
        console.error("registerDoctor Error:", err);
        logger.error(`registerDoctor : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");

    }
};

exports.loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    try {

        const modelWithMethod = {
            modelName: "Doctor",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };

        const doctor = await executeModelMethod(modelWithMethod);

        if (!doctor) {
            return sendResponse(res, 'NOT_FOUND', notFoundEmail("Doctor"));
        }

        const userId = doctor.id;
        const role = 'doctor';

        // Check if the record exists for the userId and role
        const existingRecord = await executeModelMethod({
            modelName: "LoginFailed",
            methodName: "findOne",
            args: { where: { userId, role, is_deleted: false } }
        });

        if (existingRecord && existingRecord.loginFailedCount >= 5) {
            return sendResponse(res, "TOO_MANY_REQUESTS", tooManyfailedAttempts());
        }

        const isPasswordValid = await comparePassword(password, doctor.password);

        if (!isPasswordValid) {

            if (existingRecord) {
                //Increment loginFailedCount
                const updatedRecord = await executeModelMethod({
                    modelName: "LoginFailed",
                    methodName: "update",
                    args: [
                        { loginFailedCount: existingRecord.loginFailedCount + 1 },
                        { where: { userId, role, is_deleted: false } }
                    ]
                });
            } else {
                // Create a new record for the userId and role
                const newRecord = await executeModelMethod({
                    modelName: "LoginFailed",
                    methodName: "create",
                    args: { userId, role, loginFailedCount: 1 }
                });
            }
            return sendResponse(res, 'UNAUTHORIZED', invalidCredential());
        }

        const token = generateToken({ id: doctor.id, email: doctor.email, role: 'doctor' });

        return sendResponse(res, "OK", loginSuccessful(), { token });

    } catch (err) {
        console.error("Error:", err);
        logger.error(`loginDoctor : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};


exports.getAllDoctors = async (req, res) => {
    try {

        const modelWithMethod = {
            modelName: "Doctor",
            methodName: "findAll",
            args: { where: { is_deleted: false } }
        };
        const allPatient = await executeModelMethod(modelWithMethod);
        return sendResponse(res, 'OK', null, allPatient);

    } catch (error) {
        console.error("loginPatient Error:", err);
        logger.error(`loginPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR');
    }
}


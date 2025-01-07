const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const { sendResponse } = require('../../services/responseHandler');
const { FORBIDDEN, OK } = require('../../services/statusCodes');
const generateToken = require('../../services/generateToken');
const { comparePassword, hashPassword } = require('../../services/comparePassword');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { emialExistsMessage, registeredSuccessfullyMessage, notFoundEmail, invalidCredential, loginSuccessful, notFound, updatedSuccessfully } = require('../../utils/responseMessages');
const logger = require('../../utils/logger');
const { where } = require('sequelize');

dotenv.config();

exports.registerPatient = async (req, res) => {
    let { name, last_name, email, password, phone, gender, date_of_birth, address } = req.body;

    try {

        password = await hashPassword(password);

        const modelWithMethod1 = {
            modelName: "Patient",
            methodName: "create",
            args: { name, last_name, email, password, phone, gender, date_of_birth, address }
        };

        const patient = await executeModelMethod(modelWithMethod1);

        return sendResponse(res, "CREATED", registeredSuccessfullyMessage('Patient'), patient);

    } catch (err) {
        console.error("registerPatient Error:", err);
        logger.error(`registerPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};



exports.loginPatient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const modelWithMethod = {
            modelName: "Patient",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };
        const patient = await executeModelMethod(modelWithMethod);

        if (!patient) {
            return sendResponse(res, 'NOT_FOUND', notFoundEmail('patient'));
        }

        const isPasswordValid = await comparePassword(password, patient.password);

        if (!isPasswordValid) {
            return sendResponse(res, 'UNAUTHORIZED', invalidCredential());
        }

        const token = generateToken({ id: patient.id, email: patient.email, name: patient?.name, role: 'patient' });

        return sendResponse(res, "OK", loginSuccessful(), { token });

    } catch (err) {
        console.error("loginPatient Error:", err);
        logger.error(`loginPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};



exports.updatePatient = async (req, res) => {
    const { id } = req.body;
    const updateData = req.body;

    try {
        const patient = await executeModelMethod({
            modelName: "Patient",
            methodName: "findOne",
            args: {
                where: { id, is_deleted: false }
            }
        });

        if (!patient) {
            return sendResponse(res, "NOT_FOUND", notFound("Patient"));
        }


        await executeModelMethod({
            modelName: "Patient",
            methodName: "update",
            args: [
                updateData,
                {
                    where: { id, is_deleted: false }
                }
            ]
        });

        const updatedPatient = await executeModelMethod({
            modelName: "Patient",
            methodName: "findOne",
            args: {
                where: { id, is_deleted: false }
            }
        });


        return sendResponse(res, "OK", updatedSuccessfully("Patient"), updatedPatient);

    } catch (error) {
        logger.error(`Failed to update patient: ${error.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};


exports.getAllPatient = async (req, res) => {
    try {

        const modelWithMethod = {
            modelName: "Patient",
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
};

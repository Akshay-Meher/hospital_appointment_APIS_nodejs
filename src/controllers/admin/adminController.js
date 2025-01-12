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
const { emialExistsMessage, registeredSuccessfullyMessage, notFoundEmail, invalidCredential, loginSuccessful, notFound, updatedSuccessfully, tooManyfailedAttempts } = require('../../utils/responseMessages');
const logger = require('../../utils/logger');
const { where } = require('sequelize');

dotenv.config();

exports.registerAdmin = async (req, res) => {
    let { name, last_name, email, password, hospital_id } = req.body;

    try {

        password = await hashPassword(password);

        const modelWithMethod1 = {
            modelName: "Admin",
            methodName: "create",
            args: { name, last_name, email, password, hospital_id }
        };

        const admin = await executeModelMethod(modelWithMethod1);
        const { password: _password, ...adminData } = admin.toJSON();

        return sendResponse(res, "CREATED", registeredSuccessfullyMessage('Admin'), adminData);

    } catch (err) {
        console.error("registerPatient Error:", err);
        logger.error(`registerPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};



exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const modelWithMethod = {
            modelName: "Admin",
            methodName: "findOne",
            args: { where: { email, is_deleted: false } }
        };
        const admin = await executeModelMethod(modelWithMethod);

        if (!admin) {
            return sendResponse(res, 'NOT_FOUND', notFoundEmail('admin'));
        }

        const userId = admin.id;
        const role = 'admin';

        // Check if the record exists for the userId and role
        const existingRecord = await executeModelMethod({
            modelName: "LoginFailed",
            methodName: "findOne",
            args: { where: { userId, role, is_deleted: false } }
        });

        if (existingRecord && existingRecord.loginFailedCount >= 5) {
            return sendResponse(res, "TOO_MANY_REQUESTS", tooManyfailedAttempts());
        }

        const isPasswordValid = await comparePassword(password, admin.password);

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

        const token = generateToken({ id: admin.id, email: admin.email, name: admin?.name, role: 'admin' });

        return sendResponse(res, "OK", loginSuccessful(), { token });

    } catch (err) {
        console.error("loginPatient Error:", err);
        logger.error(`loginPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};



exports.updateAdmin = async (req, res) => {
    const { id } = req.body;
    const updateData = req.body;

    try {
        const Admin = await executeModelMethod({
            modelName: "Admin",
            methodName: "findOne",
            args: {
                where: { id, is_deleted: false }
            }
        });

        if (!Admin) {
            return sendResponse(res, "NOT_FOUND", notFound("Admin"));
        }


        await executeModelMethod({
            modelName: "Admin",
            methodName: "update",
            args: [
                updateData,
                {
                    where: { id, is_deleted: false }
                }
            ]
        });

        const updatedAdmin = await executeModelMethod({
            modelName: "Admin",
            methodName: "findOne",
            args: {
                where: { id, is_deleted: false }
            }
        });


        return sendResponse(res, "OK", updatedSuccessfully("Admin"), updatedAdmin);

    } catch (error) {
        logger.error(`Failed to update Admin: ${error.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};


exports.getAllPatient = async (req, res) => {
    try {

        const modelWithMethod = {
            modelName: "Patient",
            methodName: "findAll",
            args: {
                where: { is_deleted: false },
                attributes: { exclude: ['password'] }
            }
        };
        const allPatient = await executeModelMethod(modelWithMethod);
        return sendResponse(res, 'OK', null, allPatient);

    } catch (error) {
        console.error("loginPatient Error:", err);
        logger.error(`loginPatient : ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR');
    }
};

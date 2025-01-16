const { Patient, Doctor } = require('../models');
const { generateOTP, calculateExpiration } = require('../utils/otpGenerator');
const logger = require('../utils/logger');
const { Op, where } = require('sequelize');
const { executeModelMethod } = require('../services/executeModelMethod');
const { sendResponse } = require('../services/responseHandler');
const { sendOTPEmail } = require('../utils/sendAppointmentEmail');
const { invalidOTP, notFound } = require('../utils/responseMessages');

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const role = req?.user?.role;
        // const modelName = role === 'patient' ? "Patient" : "Doctor";
        let modelName;

        if (role == 'patient') {
            modelName = "Patient"
        } else if (role == 'doctor') {
            modelName = "Doctor"
        } else if (role == 'admin') {
            modelName = "Admin"
        }

        if (!modelName) return sendResponse(res, "BAD_REQUEST");

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: {
                where: { email, is_deleted: false }
            }
        });

        if (!user) {
            return sendResponse(res, "NOT_FOUND");
        }

        const otp = generateOTP();
        const otpExpiration = calculateExpiration();

        const checkOtpExist = await executeModelMethod({
            modelName: "OtpToken",
            methodName: "findOne",
            args: { where: { is_deleted: false, userId: user.id, role } }
        });

        // console.log("checkOtpExist", checkOtpExist);

        if (checkOtpExist) {
            await executeModelMethod({
                modelName: "OtpToken",
                methodName: "update",
                args: [
                    { otp, otpExpiration: otpExpiration },
                    { where: { userId: user.id, role, is_deleted: false } }
                ]
            });
        } else {
            const createdOTP = await executeModelMethod({
                modelName: "OtpToken",
                methodName: "create",
                args: { userId: user.id, role, otp, otpExpiration: otpExpiration },
            });
        }

        sendOTPEmail(email, otp);

        return sendResponse(res, "OK");

    } catch (error) {
        logger.error(`Failed to send OTP: ${error.message}`);
        console.log("error", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");

    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const role = req?.user?.role;
        // const modelName = role === 'patient' ? "Patient" : "Doctor";
        let modelName;
        if (role == 'patient') {
            modelName = "Patient"
        } else if (role == 'doctor') {
            modelName = "Doctor"
        } else if (role == 'admin') {
            modelName = "Admin"
        }

        if (!modelName) return sendResponse(res, "BAD_REQUEST");

        const user = await executeModelMethod({
            modelName,
            methodName: "findOne",
            args: {
                where: {
                    email,
                    is_deleted: false,
                    // otp,
                    // otp_expiration: { [Op.gt]: new Date() }
                }
            }
        });

        if (!user) {
            return sendResponse(res, "BAD_REQUEST", notFound(role + " User"));
            // return sendResponse(res, "BAD_REQUEST", invalidOTP("OTP"));
        }

        const OTPRecord = await executeModelMethod({
            modelName: "OtpToken",
            methodName: "findOne",
            args: {
                where: {
                    userId: user.id,
                    role,
                    is_deleted: false,
                    otp,
                    otpExpiration: { [Op.gt]: new Date() }
                }
            }
        });


        if (!OTPRecord) {
            return sendResponse(res, "BAD_REQUEST", invalidOTP("OTP"));
        }

        await OTPRecord.update({ is_email_verified: true, otp: null, otpExpiration: null });
        return sendResponse(res, "OK", "email verified successfully");

    } catch (error) {
        logger.error(`Failed to verify OTP: ${error.message}`);
        console.log("error", error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
        // res.status(500).json({ error: 'Failed to verify OTP. Please try again later.' });

    }
};

module.exports = { sendOTP, verifyOTP };

const { validationResult } = require('express-validator');
const { DoctorFeedback, Doctor, Patient } = require('../../models');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { sendResponse } = require('../../services/responseHandler');
const { submittedSuccessfully, fieldRequired, notFound } = require('../../utils/responseMessages');
const { isRecordExists } = require('../../utils/isRecordExists');



// 1. Patient gives feedback to a doctor
exports.giveFeedback = async (req, res) => {

    const { patient_id, doctor_id, feedback_text, rating } = req.body;

    try {

        const isDoctorExist = await isRecordExists(doctor_id, "Doctor");
        if (!isDoctorExist) return sendResponse(res, "NOT_FOUND", notFound("Doctor"));

        const isPatientExist = await isRecordExists(patient_id, "Patient");
        if (!isPatientExist) return sendResponse(res, "NOT_FOUND", notFound("Patient"));

        const feedback = await executeModelMethod({
            modelName: "DoctorFeedback",
            methodName: "create",
            args: { patient_id, doctor_id, feedback_text, rating, }
        });

        return sendResponse(res, "OK", submittedSuccessfully("Feedback"), feedback);

    } catch (err) {
        console.error(`Error in giveFeedback: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

// 2. Get all feedbacks for a patient (with doctor info)
exports.getFeedbacksByPatient = async (req, res) => {

    const { patient_id } = req.params;
    if (!patient_id) return sendResponse(res, "BAD_REQUEST", fieldRequired('patient_id'));

    try {
        const feedbacks = await executeModelMethod({
            modelName: "DoctorFeedback",
            methodName: "findAll",
            args: {
                where: { patient_id, is_deleted: false },
                include: [
                    {
                        model: Doctor,
                        attributes: ['id', 'name', 'specialization'],
                    },
                ],
            }
        });
        return sendResponse(res, "OK", null, feedbacks);
    } catch (err) {
        console.error(`Error in getFeedbacksByPatient: ${err.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

// 3. Get all feedbacks for a doctor (with patient info)
exports.getFeedbacksByDoctor = async (req, res) => {
    const { doctor_id } = req.params;
    try {
        const feedbacks = await executeModelMethod({
            modelName: "DoctorFeedback",
            methodName: "findAll",
            args: {
                where: { doctor_id, is_deleted: false },
                include: [
                    {
                        model: Patient,
                        attributes: ['id', 'name', 'email'],
                    },
                ],
            }
        });

        return sendResponse(res, "OK", null, feedbacks);
    } catch (err) {
        console.error(`Error in getFeedbacksByDoctor: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

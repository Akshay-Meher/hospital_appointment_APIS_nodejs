const { Admit, Hospital } = require('../../models');
const { sendResponse } = require('../../services/responseHandler');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../../services/statusCodes');
const { executeModelMethod } = require('../../services/executeModelMethod');
const logger = require('../../utils/logger');
const { notFound } = require('../../utils/responseMessages');
const { isRecordExists } = require('../../utils/isRecordExists');

const admitPatient = async (req, res) => {

    const { patient_id, doctor_id, hospital_id, admit_date, status, notes } = req.body;

    try {

        const isExist = await isRecordExists(hospital_id, "Hospital");
        if (!isExist) return sendResponse(res, "NOT_FOUND", notFound("hospital"));

        const isDoctorExist = await isRecordExists(doctor_id, "Doctor");
        if (!isDoctorExist) return sendResponse(res, "NOT_FOUND", notFound("Doctor"));

        const isPatientExist = await isRecordExists(patient_id, "Patient");
        if (!isPatientExist) return sendResponse(res, "NOT_FOUND", notFound("Patient"));

        // Fetch hospital details
        const modelWithMethod = {
            modelName: 'Hospital',
            methodName: 'findOne',
            args: { where: { id: hospital_id, is_deleted: false } },
        };

        const hospital = await executeModelMethod(modelWithMethod);

        if (!hospital) {
            return sendResponse(res, "NOT_FOUND", notFound("hospital"));
        }

        if (hospital.available_beds <= 0) {
            return sendResponse(res, "BAD_REQUEST", 'No available beds in the hospital');
        }

        // Create admission
        const admitModelWithMethod = {
            modelName: 'Admit',
            methodName: 'create',
            args: { patient_id, doctor_id, hospital_id, admit_date, status, notes },
        };

        const admitRecord = await executeModelMethod(admitModelWithMethod);

        // Update available beds
        await executeModelMethod({
            modelName: 'Hospital',
            methodName: 'update',
            args: [
                { available_beds: hospital.available_beds - 1 },
                { where: { id: hospital_id } },
            ],
        });

        return sendResponse(res, CREATED, 'Patient admitted successfully', admitRecord);
    } catch (err) {
        logger.error(`admitPatient : ${err.message}`);
        return sendResponse(res, INTERNAL_SERVER_ERROR);
    }
};

module.exports = { admitPatient };

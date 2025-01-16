const express = require('express');
const router = express.Router();
const { Doctor, Hospital, DoctorHospital } = require('../../models');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { sendResponse } = require('../../services/responseHandler');
const { DoctorAlreadyAssociated, doctorAddedToHospital, notFound } = require('../../utils/responseMessages');
const { isRecordExists } = require('../../utils/isRecordExists');

// Route to add a doctor to a hospital
const addDoctorToHosital = async (req, res) => {
    const { hospital_id, doctor_id } = req.body;

    try {

        const isExist = await isRecordExists(hospital_id, "Hospital");
        if (!isExist) return sendResponse(res, "NOT_FOUND", notFound("hospital"));

        const isDoctorExist = await isRecordExists(doctor_id, "Doctor");
        if (!isDoctorExist) return sendResponse(res, "NOT_FOUND", notFound("Doctor"));

        const existingAssociation = await executeModelMethod({
            modelName: "DoctorHospital",
            methodName: "findOne",
            args: { where: { hospital_id, doctor_id, is_deleted: false } }
        });

        if (existingAssociation) {
            return sendResponse(res, "BAD_REQUEST", DoctorAlreadyAssociated());
        }

        await executeModelMethod({
            modelName: "DoctorHospital",
            methodName: "create",
            args: { hospital_id, doctor_id }
        });

        return sendResponse(res, "CREATED", doctorAddedToHospital());

    } catch (error) {
        console.error('Error adding doctor to hospital:', error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}

const getAllDoctorsFromHospital = async (req, res) => {
    const { id } = req.params;

    console.log("getAllDoctorsFromHospital", id);

    try {
        const hospital = await executeModelMethod({
            modelName: "Hospital",
            methodName: "findOne",
            args: {
                where: { id: id, is_deleted: false },
                include: {
                    model: Doctor,
                    through: {
                        where: { is_deleted: false },
                    },
                    // Exclude sensitive information
                    attributes: { exclude: ['password'] },
                },
            }
        });

        if (!hospital) {
            return sendResponse(res, "NOT_FOUND", notFound('Hospital'));
        }

        return sendResponse(res, "OK", null, hospital.Doctors);
    } catch (error) {
        console.error('Error fetching doctors for hospital in getAllDoctorsFromHospital:', error);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
}

module.exports = { addDoctorToHosital, getAllDoctorsFromHospital };

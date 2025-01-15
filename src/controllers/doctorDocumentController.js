// const fs = require('fs');
const path = require('path');
const { DoctorDocument } = require('../models');
const { executeModelMethod } = require('../services/executeModelMethod');
const { sendResponse } = require('../services/responseHandler');
const { where } = require('sequelize');
const { uploadedSuccessfully, verifiedSuccessfully } = require('../utils/responseMessages');
const { ensureDirectoryExists, copyFile } = require('../utils/fileOperations');


exports.uploadDocuments = async (req, res) => {

    try {
        const { doctor_id } = req.body;
        const aadhaarCardFile = req.files['aadhaar_card']?.[0];
        const certificateFile = req.files['certificate']?.[0];

        console.log("doctor_id: ", doctor_id, aadhaarCardFile, certificateFile);

        // Dynamic upload folder
        const uploadDir = path.join(__dirname, '../../public/upload/doctor_' + doctor_id);
        await ensureDirectoryExists(uploadDir);

        // Define destination paths
        const aadhaarCardPath = path.join(uploadDir, aadhaarCardFile.filename);
        const certificatePath = path.join(uploadDir, certificateFile.filename);

        // copy files from temp to upload directory
        await copyFile(aadhaarCardFile.path, aadhaarCardPath);
        await copyFile(certificateFile.path, certificatePath);

        const checkDocumentExists = await executeModelMethod({
            modelName: "DoctorDocument",
            methodName: "findOne",
            args: { where: { doctor_id, is_deleted: false } }
        })

        if (checkDocumentExists) {
            const updateDocs = await executeModelMethod({
                modelName: "DoctorDocument",
                methodName: "update",
                args: [
                    {
                        aadhaar_card: `/upload/doctor_${doctor_id}/${aadhaarCardFile.filename}`,
                        certificate: `/upload/doctor_${doctor_id}/${certificateFile.filename}`
                    },
                    {
                        where: { doctor_id, is_deleted: false }
                    }
                ]
            });

            return sendResponse(res, "CREATED", uploadedSuccessfully("Documents"), updateDocs);

        } else {
            const newDocument = await executeModelMethod({
                modelName: "DoctorDocument",
                methodName: "create",
                args: {
                    doctor_id,
                    aadhaar_card: `/upload/doctor_${doctor_id}/${aadhaarCardFile.filename}`,
                    certificate: `/upload/doctor_${doctor_id}/${certificateFile.filename}`,
                }
            });
            return sendResponse(res, "CREATED", uploadedSuccessfully("Documents"), newDocument);
        }

    } catch (err) {
        console.error(`Error uploading documents: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

exports.verifyDocs = async (req, res) => {
    try {
        const { doctor_id } = req.body;
        await executeModelMethod({
            modelName: "DoctorDocument",
            methodName: "update",
            args: [
                {
                    isAadhaarVerified: true,
                    isCertificateVerified: true,
                },
                {
                    where: { doctor_id, is_deleted: false }
                }
            ]
        });

        const docs = await executeModelMethod({
            modelName: "DoctorDocument",
            methodName: "findOne",
            args: { where: { doctor_id } }
        })
        return sendResponse(res, "OK", verifiedSuccessfully("documents"), docs);
    } catch (err) {
        console.error(`Error verifyDocs documents: ${err.message}`);
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};
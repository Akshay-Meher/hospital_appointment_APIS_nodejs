const { sendEmail } = require('../../services/email/emailSender');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { sendResponse } = require('../../services/responseHandler');
const logger = require('../../utils/logger');
const { doestNotExist, allreadyBooked, appBookSuccess, notFound } = require('../../utils/responseMessages');
// const { sendAppointmentConfirmation } = require('../../utils/sendAppointmentConfirmation');
const { Appointment, Patient, Doctor, Sequelize } = require('../../models');
const { Op, fn, col } = require('sequelize');
const { sendAppointmentEmail } = require('../../utils/sendAppointmentEmail');



const bookAppointment = async (req, res) => {
    const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;

    try {

        const patient = await executeModelMethod({
            modelName: 'Patient',
            methodName: 'findOne',
            args: { where: { id: patient_id, is_deleted: false } },
        });

        if (!patient) {
            return sendResponse(res, 'NOT_FOUND', doestNotExist("Patient"));
        }


        const doctor = await executeModelMethod({
            modelName: 'Doctor',
            methodName: 'findOne',
            args: { where: { id: doctor_id, is_deleted: false } },
        });
        if (!doctor) {
            return sendResponse(res, 'NOT_FOUND', doestNotExist("Doctor"));
        }

        // Check if the doctor is available at the given time and date
        const conflictingAppointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'findOne',
            args: {
                where: {
                    doctor_id,
                    appointment_time,
                    is_deleted: false,
                    [Op.and]: Sequelize.where(
                        fn('DATE', col('appointment_date')),
                        Op.eq,
                        appointment_date
                    ),
                },
            },
        });

        if (conflictingAppointment) {
            return sendResponse(
                res,
                'CONFLICT',
                allreadyBooked()
            );
        }

        // Book the appointment
        const appointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'create',
            args: {
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                status: status || 'pending',
            },
        });


        const role = req?.user?.role;


        if (role == 'patient') {
            const recipient = req?.user?.email;
            const recipientName = req?.user?.name;
            const date = appointment?.appointment_date;
            const time = appointment?.appointment_time;
            const doctor_name = doctor?.name;
            // sendAppointmentConfirmation(recipient, recipientName, date, time, doctor_name, res);
            sendAppointmentEmail(recipient, recipientName, date, time, doctor_name, 'booking', res);

        }

        return sendResponse(res, 'CREATED', appBookSuccess(), appointment);
    } catch (err) {
        console.error('Error:', err);
        logger.error(`bookAppointment Controller: ${err.message}`);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR', "INTERNAL SERVER ERROR");
    }
};



const getAppointments = async (req, res) => {
    const { role, id } = req.body;

    try {
        const modelName = role === 'patient' ? 'Patient' : 'Doctor';
        const association = role === 'patient' ? 'Appointments' : 'Appointments';

        const includeModel = role === 'patient'
            ? { model: Doctor, as: 'doctorDetails', attributes: { exclude: ['password'] } }
            : { model: Patient, as: 'patientDetails', attributes: { exclude: ['password'] } };


        // console.log("modelname", modelName, role, id);

        const appointments = await executeModelMethod({
            modelName,
            methodName: 'findOne',
            args: {
                where: { id, is_deleted: false },
                attributes: { exclude: ['password'] },
                include: [{
                    model: Appointment,
                    as: 'appointments',
                    include: [includeModel],
                }],
            },
        });

        if (!appointments) {
            return sendResponse(res, "NOT_FOUND", null, notFound('appointments'));
        }

        logger.info(`Appointments fetched for ${role} with ID: ${id}`);
        return sendResponse(res, "OK", null, appointments);
    } catch (error) {
        console.log(error);
        logger.error('Failed to fetch appointments', { error });
        return sendResponse(res, "INTERNAL_SERVER_ERROR");
    }
};

module.exports = { getAppointments, bookAppointment };
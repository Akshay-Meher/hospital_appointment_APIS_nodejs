const { Appointment, sequelize } = require('../../models');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { sendResponse } = require('../../services/responseHandler');
const { notFound, notAuthorized, confirmedSuccessfully, notAuthorizedLogin } = require('../../utils/responseMessages');
const { sendAppointmentEmail } = require('../../utils/sendAppointmentEmail');


/**
 * Confirm an appointment by a doctor.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const confirmAppointment = async (req, res) => {
    const { appointment_id } = req.body;
    const doctor_id = req.user.id;

    console.log("Login user", req.user);

    try {
        // Find the appointment
        const appointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'findOne',
            args: {
                where: { id: appointment_id, is_deleted: false },
                include: [
                    {
                        model: sequelize.models.Patient,
                        as: 'patientDetails',
                        attributes: ['name', 'email'],
                    },
                ],
            },
        });

        if (!appointment) {
            return sendResponse(res, 'NOT_FOUND', notFound('Appointment'));
        }

        if (req.user.role != 'doctor') {
            return sendResponse(res, 'FORBIDDEN', notAuthorizedLogin("doctor"));
        }

        if (appointment.doctor_id !== doctor_id) {
            return sendResponse(res, 'FORBIDDEN', notAuthorized("Appointment", "confirm"));
        }

        const updatedAppointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'update',
            args: [
                { status: 'confirmed' },
                { where: { id: appointment_id, is_deleted: false } },
            ],
        });

        // Send confirmation response
        const doctor = await executeModelMethod({
            modelName: 'Doctor',
            methodName: 'findOne',
            args: { where: { id: appointment.doctor_id, is_deleted: false } },
        });

        const patient = await executeModelMethod({
            modelName: "Patient",
            methodName: "findOne",
            args: { where: { id: appointment.patient_id, is_deleted: false } }
        });

        const recipient = patient?.email;
        const recipientName = patient?.name;
        const date = appointment?.appointment_date;
        const time = appointment?.appointment_time;
        const doctor_name = doctor?.name;
        sendAppointmentEmail(recipient, recipientName, date, time, doctor_name, 'confirmation', res);

        return sendResponse(res, 'OK', confirmedSuccessfully("Appointment"), updatedAppointment);
    } catch (err) {
        console.error('Error in confirmAppointment:', err);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR');
    }
};

module.exports = { confirmAppointment };

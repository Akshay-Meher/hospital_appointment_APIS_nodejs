const { sequelize } = require('../../models');

const moment = require('moment');
const { sendResponse } = require('../../services/responseHandler');
const { executeModelMethod } = require('../../services/executeModelMethod');
const { notFound, notAuthorized, cancelledSuccessfully } = require('../../utils/responseMessages');
const { sendAppointmentEmail } = require('../../utils/sendAppointmentEmail');
const { where } = require('sequelize');
const { sendFirebaseNotification } = require('../../services/firebase/sendFirebaseNotification');

/**
 * Cancel an appointment.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
const cancelAppointment = async (req, res) => {
    const { appointment_id } = req.body;
    const user_id = req.user.id;
    const role = req.user.role;

    try {

        const appointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'findOne',
            args: {
                where: { id: appointment_id, is_deleted: false },
            },
        });

        if (!appointment) {
            return sendResponse(res, 'NOT_FOUND', notFound('Appointment'));
        }

        if (role === 'patient' && appointment.patient_id !== user_id) {
            return sendResponse(res, 'FORBIDDEN', notAuthorized("Appointment", "cancle"));
        }

        if (role === 'doctor' && appointment.doctor_id !== user_id) {
            return sendResponse(res, 'FORBIDDEN', notAuthorized("Appointment", "cancle"));
        }

        if (role === 'patient') {
            const now = moment();
            const appointmentTime = moment(`${appointment.appointment_date} ${appointment.appointment_time}`);
            const timeDifference = appointmentTime.diff(now, 'hours');

            if (timeDifference < 2) {
                return sendResponse(
                    res,
                    'FORBIDDEN',
                    "You can only cancel an appointment at least 2 hours before the scheduled time."
                );
            }
        }

        // Update the appointment status to 'Cancelled'
        const updatedAppointment = await executeModelMethod({
            modelName: 'Appointment',
            methodName: 'update',
            args: [
                { status: 'cancelled' },
                { where: { id: appointment_id, is_deleted: false } },
            ],
        });

        // const role = req?.user?.role;
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
        sendAppointmentEmail(recipient, recipientName, date, time, doctor_name, 'cancellation', res);

        const token = await executeModelMethod({
            modelName: "FirebaseToken",
            methodName: "findOne",
            args: { where: { userId: user_id, role, is_deleted: false } }
        });

        if (!token) {
            return sendResponse(res, 'NOT_FOUND', notFound('FirebaseToken'));
        }

        const message = {
            notification: {
                title: cancelledSuccessfully("Appointment"),
                body: cancelledSuccessfully("Appointment"),
                "token": token?.token
            },

        }
        sendFirebaseNotification(message);

        return sendResponse(res, 'OK', cancelledSuccessfully("Appointment"), updatedAppointment);

    } catch (err) {
        console.error('Error in cancelAppointment:', err);
        return sendResponse(res, 'INTERNAL_SERVER_ERROR');
    }
};

module.exports = { cancelAppointment };

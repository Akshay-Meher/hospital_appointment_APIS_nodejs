const logger = require("../../utils/logger");
const { sendResponse } = require("../responseHandler");
const { admin } = require("./firebase-admin");




/**
 * 
 * @param { Object } message - The notification message to send.
 * @param { Object } message.notification - The notification content.
 * @param { string } message.notification.title - The title of the notification, displayed in the notification bar.
 * @param { string } message.notification.body - The body of the notification, providing more details.
 * @param { string } message.token - The recipient's unique device token used to send the notification.
 * @returns { Promise < void>} Resolves if the notification is sent successfully.Logs and handles errors otherwise.
 */

const sendFirebaseNotification = async (message) => {

    try {
        await admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log("Notification sent successfully:", response);
            })
            .catch((error) => {
                console.error("Error sending notification:", error);
                logger.error(`Error sending notification ${err.message}`);
            });

    } catch (error) {
        console.log("error: sendFirebaseNotification", error);
        logger.error(`Error sending notification ${err.message}`);
    }
}

module.exports = { sendFirebaseNotification };
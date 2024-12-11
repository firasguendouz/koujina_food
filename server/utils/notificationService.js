// utils/notificationService.js
const logger = require('./logger');
const { sendEmail } = require('./emailService');
const Notification = require('../models/Notification'); // Assuming there's a Notification model

const sendNotification = async (userId, type, message) => {
    try {
        // Create a new notification in the database
        await Notification.create({ userId, type, message, status: 'unread' });
        logger.info(`Notification created for user ${userId}: "${message}"`);
    } catch (error) {
        logger.error(`Failed to create notification: ${error.message}`);
    }
};

const notifyByEmail = async (email, subject, message) => {
    try {
        await sendEmail(email, subject, message);
        logger.info(`Notification email sent to ${email}`);
    } catch (error) {
        logger.error(`Failed to send notification email to ${email}: ${error.message}`);
    }
};

module.exports = { sendNotification, notifyByEmail };

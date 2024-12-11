// utils/emailService.js
const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Update this with your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to} with subject: "${subject}"`);
    } catch (error) {
        logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
};

module.exports = { sendEmail };

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send 2FA Code
exports.send2FACode = async (phoneNumber) => {
    try {
        const verification = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({ to: phoneNumber, channel: 'sms' });

        return verification.sid; // Return SID for reference (optional)
    } catch (error) {
        console.error('Error sending 2FA code:', error);
        return null;
    }
};

// Verify 2FA Code
exports.verify2FACode = async (phoneNumber, code) => {
    try {
        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: phoneNumber, code });

        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error('Error verifying 2FA code:', error);
        return false;
    }
};

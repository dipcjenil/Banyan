const nodemailer = require('nodemailer');

// Helper to log OTP to console in dev mode
const logOTPToConsole = (to, subject, html) => {
    const otpMatch = html.match(/>(\d{6})</);
    if (otpMatch) {
        console.log('\n-----------------------------------');
        console.log(`DEBUG: OTP for ${to} is [ ${otpMatch[1]} ]`);
        console.log(`SUBJECT: ${subject}`);
        console.log('-----------------------------------\n');
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email with optional attachments
 */
const sendEmail = async (to, subject, html, attachments = []) => {
    // Always log OTP to console for debugging/convenience
    logOTPToConsole(to, subject, html);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('CRITICAL: EMAIL_USER or EMAIL_PASS not set in .env. Email will only be logged to console.');
        return true; // Return true so the flow doesn't break in dev if email is missing
    }

    try {
        const mailOptions = {
            from: `"Banyan Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email successfully sent to:', to);
        return true;
    } catch (error) {
        console.error('Email send failed:', error.message);
        // We return true because we've already logged it to console for the developer
        // and we don't want to block the signup flow if the email service is down or misconfigured
        return true; 
    }
};

module.exports = { sendEmail };

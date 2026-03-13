const nodemailer = require('nodemailer');

// ── Helper: Extract and log OTP from HTML for debug purposes ─────────────────
const logOTPToConsole = (to, subject, html) => {
    const otpMatch = html.match(/>(\d{6})</);
    if (otpMatch) {
        console.log('\n==================================');
        console.log(`📧 OTP EMAIL DEBUG`);
        console.log(`   TO:      ${to}`);
        console.log(`   SUBJECT: ${subject}`);
        console.log(`   OTP:     [ ${otpMatch[1]} ]`);
        console.log('==================================\n');
    }
};

// ── Create transporter with explicit Gmail SMTP settings ──────────────────────
// Using port 465 (SSL) instead of 587 (TLS/STARTTLS) because
// many cloud hosts (Render, Railway, etc.) have issues with STARTTLS on 587.
const createTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.warn('[Email] EMAIL_USER or EMAIL_PASS not set — email will be console-only.');
        return null;
    }

    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,          // SSL on port 465
        auth: { user, pass },
        tls: {
            rejectUnauthorized: false  // Allow Render's proxy/internal TLS
        },
        connectionTimeout: 10000,
        socketTimeout: 15000,
    });
};

/**
 * Send an email via Gmail SMTP.
 * Always logs OTP to console as a fallback.
 * Never throws — returns true regardless so the auth flow doesn't break.
 */
const sendEmail = async (to, subject, html, attachments = []) => {
    // Always log for debugging
    logOTPToConsole(to, subject, html);

    const transporter = createTransporter();

    if (!transporter) {
        // No credentials — skip SMTP but flow continues
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Banyan Portal" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        console.log(`[Email] ✅ Sent successfully to ${to} — MessageId: ${info.messageId}`);
        return true;
    } catch (err) {
        // Log detailed error for debugging on Render logs
        console.error(`[Email] ❌ Failed to send to ${to}`);
        console.error(`[Email]    Code: ${err.code}`);
        console.error(`[Email]    Message: ${err.message}`);
        if (err.response) {
            console.error(`[Email]    SMTP Response: ${err.response}`);
        }
        // Don't break the flow — signup/OTP still works, user just won't get email
        return true;
    }
};

module.exports = { sendEmail };

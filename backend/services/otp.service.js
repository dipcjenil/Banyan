const crypto = require('crypto');

/**
 * Generates a 6-digit numeric OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Hash the OTP for secure storage
 */
const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Returns OTP expiry time (10 minutes from now)
 */
const getOTPExpiry = () => {
    return Date.now() + 10 * 60 * 1000;
};

/**
 * Check if the OTP is expired
 */
const isOTPExpired = (expiry) => {
    return Date.now() > expiry;
};

module.exports = {
    generateOTP,
    hashOTP,
    getOTPExpiry,
    isOTPExpired
};

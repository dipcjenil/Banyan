const User = require('../models/User.model');
const { generateOTP, getOTPExpiry, isOTPExpired } = require('./otp.service');

/**
 * Find or create user by mobile number
 */
const findOrCreateUser = async (mobileNumber) => {
    let user = await User.findOne({ mobileNumber });
    if (!user) {
        user = new User({ mobileNumber });
    }
    return user;
};

/**
 * Generate OTP, save to user record, return otp
 */
const createAndSaveOTP = async (user) => {
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = getOTPExpiry();
    await user.save();
    return otp;
};

/**
 * Verify OTP for a given mobile number
 */
const verifyUserOTP = async (mobileNumber, otp) => {
    const user = await User.findOne({ mobileNumber });

    if (!user) {
        return { success: false, message: 'User not found. Please request OTP first.' };
    }

    if (isOTPExpired(user.otpExpiry)) {
        return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (user.otp !== otp) {
        return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    // Mark as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return { success: true, user };
};

module.exports = { findOrCreateUser, createAndSaveOTP, verifyUserOTP };

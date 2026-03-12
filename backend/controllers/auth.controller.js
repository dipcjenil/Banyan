const User = require('../models/User.model');
const Registration = require('../models/Registration.model');
const bcrypt = require('bcryptjs');
const { signToken, setAuthCookie } = require('../utils/jwt.utils');
const { sendEmail } = require('../services/email.service');
const { generateOTP, getOTPExpiry, hashOTP, isOTPExpired } = require('../services/otp.service');
const asyncHandler = require('express-async-handler');

/**
 * Send OTP to Email
 */
const sendAuthOTP = async (user) => {
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    
    user.otp = otpHash;
    user.otpExpiry = getOTPExpiry();
    await user.save();

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #28a745; text-align: center;">Banyan Authentication</h2>
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Your verification code for Banyan is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #040b2a; text-align: center; margin: 20px 0; letter-spacing: 5px;">${otp}</div>
            <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in 10 minutes.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
    `;

    return await sendEmail(user.email, 'Banyan Verification Code', html);
};

/**
 * POST /api/auth/signup-init
 */
const signupInit = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = new User({
        email,
        password: hashedPassword,
        role
    });

    const emailSent = await sendAuthOTP(user);
    if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send verification email' });
    }

    res.status(200).json({ success: true, message: 'Verification code sent to email' });
});

/**
 * POST /api/auth/login-init (Now direct login)
 */
const loginInit = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken({ userId: user._id, role: user.role });
    setAuthCookie(res, token);

    res.status(200).json({ 
        success: true, 
        message: 'Logged in successfully',
        user: { id: user._id, email: user.email, role: user.role, isRegistered: user.isRegistered },
        token
    });
});

/**
 * POST /api/auth/verify-otp
 */
const verifyOTP = asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== hashOTP(code)) {
        return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    if (isOTPExpired(user.otpExpiry)) {
        return res.status(400).json({ success: false, message: 'Code expired' });
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    // Send Welcome Email if this is the first time
    if (!user.isRegistered) {
         const welcomeHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; text-align: center; border: 1px solid #eee; border-radius: 20px;">
                <div style="margin-bottom: 30px;">
                    <h1 style="color: #040b2a; margin: 0; font-size: 32px; letter-spacing: 2px;">BANYAN</h1>
                    <div style="width: 50px; height: 4px; background: #28a745; margin: 10px auto;"></div>
                </div>
                <h2 style="color: #28a745; font-size: 24px;">Welcome to the Digital Registry</h2>
                <p style="color: #666; font-size: 16px; line-height: 1.6;">
                    Hello <strong>${user.email}</strong>,<br><br>
                    Your account has been successfully verified. We're excited to have you join Banyan Corporate. 
                    Please complete your registry profile to receive your official digital identity card.
                </p>
                <div style="margin: 40px 0;">
                    <a href="http://localhost:5173/dashboard" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(40,167,69,0.3);">
                        Access Your Dashboard
                    </a>
                </div>
                <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
            </div>
        `;
        sendEmail(user.email, 'Welcome to Banyan Corporate', welcomeHtml).catch(err => console.error(err));
    }

    await user.save();

    const token = signToken({ userId: user._id, role: user.role });
    setAuthCookie(res, token);

    res.status(200).json({
        success: true,
        message: 'Verified successfully',
        user: { id: user._id, email: user.email, role: user.role, isRegistered: user.isRegistered },
        token
    });
});

/**
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpiry');
    res.status(200).json({ success: true, user });
});

/**
 * POST /api/auth/logout
 */
const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.status(200).json({ success: true, message: 'Logged out' });
};

/**
 * GET /api/auth/stats (Admin only)
 */
const getStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRegistrations = await User.countDocuments({ isRegistered: true });
    
    res.status(200).json({
        success: true,
        stats: { totalUsers, totalRegistrations }
    });
});

/**
 * GET /api/auth/registrations (Admin only)
 */
const getRegistrations = asyncHandler(async (req, res) => {
    const registrations = await Registration.find().populate('user', 'email role');
    res.status(200).json({ success: true, registrations });
});

module.exports = { signupInit, loginInit, verifyOTP, logout, getMe, getStats, getRegistrations };

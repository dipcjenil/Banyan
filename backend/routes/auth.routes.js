const express = require('express');
const router = express.Router();
const { signupInit, loginInit, verifyOTP, logout, getMe, getStats, getRegistrations } = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// @route   POST /api/auth/signup-init
router.post('/signup-init', signupInit);

// @route   POST /api/auth/login-init
router.post('/login-init', loginInit);

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', verifyOTP);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   GET /api/auth/me
router.get('/me', protect, getMe);

// @route   GET /api/auth/stats
router.get('/stats', protect, admin, getStats);

// @route   GET /api/auth/registrations
router.get('/registrations', protect, admin, getRegistrations);

module.exports = router;

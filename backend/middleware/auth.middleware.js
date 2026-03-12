const { verifyToken } = require('../utils/jwt.utils');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
    try {
        // Check token from cookie or Authorization header
        let token = req.cookies?.auth_token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-otp -otpExpiry');

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };

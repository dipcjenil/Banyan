const jwt = require('jsonwebtoken');

const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const setAuthCookie = (res, token) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: isProd,           // must be true in production for sameSite=None
        sameSite: isProd ? 'None' : 'Lax',  // None required for cross-origin (Vercel <-> Render)
        maxAge: 7 * 24 * 60 * 60 * 1000    // 7 days
    });
};

module.exports = { signToken, verifyToken, setAuthCookie };

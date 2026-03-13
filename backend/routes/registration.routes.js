const express = require('express');
const router = express.Router();
const { submitRegistration, getMyRegistration, adminRegisterUser } = require('../controllers/registration.controller');
const { protect, admin } = require('../middleware/auth.middleware');

router.post('/submit', protect, submitRegistration);
router.get('/my', protect, getMyRegistration);
router.post('/admin-register', protect, admin, adminRegisterUser);

module.exports = router;

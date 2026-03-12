const express = require('express');
const router = express.Router();
const { submitRegistration, getMyRegistration } = require('../controllers/registration.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/submit', protect, submitRegistration);
router.get('/my', protect, getMyRegistration);

module.exports = router;
